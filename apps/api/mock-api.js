/**
 * VERTEX ERP — Mock API (без базы данных)
 *
 * Запуск:  node apps/api/mock-api.js
 * Затем:   npm run dev  (в apps/web)
 * Сайт:    http://localhost:3000
 *
 * Логин: director / любой пароль
 */

const http = require('http');
const PORT = 4000;

// ─── Mock data ────────────────────────────────────────────────────────────────

const USERS = [
  { id: 1, login: 'director',   password: 'director2026',   name: 'Асылбек Марупов',      role: 'director' },
  { id: 2, login: 'accountant', password: 'accountant2026', name: 'Айгуль Жаксыбекова',   role: 'accountant' },
  { id: 3, login: 'hr',         password: 'hr2026',         name: 'Данияр Асылбеков',      role: 'hr' },
  { id: 4, login: 'commercial', password: 'commercial2026', name: 'Нуржан Бейсенов',       role: 'commercial_director' },
  { id: 5, login: 'quarry',     password: 'quarry2026',     name: 'Болат Ержанов',         role: 'quarry_manager' },
];

const EMPLOYEES = [
  { id: 1, fullName: 'Ержанов Болат',       position: 'Оператор экскаватора', baseSalary: '70000', plate: { plate: 'KG 0012 AB', vehicle: 'КАМАЗ-65115' } },
  { id: 2, fullName: 'Темиров Алмас',       position: 'Водитель самосвала',   baseSalary: '65000', plate: { plate: 'KG 1543 CD', vehicle: 'Volvo FH16' } },
  { id: 3, fullName: 'Касымов Нурлан',      position: 'Механик',              baseSalary: '75000', plate: null },
  { id: 4, fullName: 'Асылбеков Данияр',    position: 'Инженер-геолог',       baseSalary: '90000', plate: { plate: 'KG 7723 EF', vehicle: 'Toyota Land Cruiser 200' } },
  { id: 5, fullName: 'Жаксыбекова Айгуль',  position: 'Бухгалтер',           baseSalary: '80000', plate: null },
  { id: 6, fullName: 'Маратов Серик',       position: 'Охранник КПП',         baseSalary: '55000', plate: { plate: 'KG 3312 GH', vehicle: 'ВАЗ-21099' } },
  { id: 7, fullName: 'Дуйсенов Берик',      position: 'Геодезист',            baseSalary: '85000', plate: null },
];

// Рабочие дни июня 2026 (пн-пт): 1-5, 8-12, 15-19, 22-26, 29-30 = 22 дня
const JUNE_WORK_DAYS = [1,2,3,4,5, 8,9,10,11,12, 15,16,17,18,19, 22,23,24,25,26, 29,30];

// Посещаемость за июнь: у каждого сотрудника свой набор дней
const JUNE_ATTENDANCE_DAYS = {
  1: JUNE_WORK_DAYS,                            // Ержанов: 22 дня
  2: JUNE_WORK_DAYS.filter(d => d !== 15),      // Темиров: 21 день
  3: JUNE_WORK_DAYS.filter(d => d !== 10 && d !== 26), // Касымов: 20 дней
  4: JUNE_WORK_DAYS,                            // Асылбеков: 22 дня
  5: JUNE_WORK_DAYS,                            // Жаксыбекова: 22 дня
  6: JUNE_WORK_DAYS.filter(d => d > 8),         // Маратов: 18 дней
  7: JUNE_WORK_DAYS.filter(d => d !== 3),       // Дуйсенов: 21 день
};

// Генерация записей посещаемости
function buildAttendanceRecords() {
  const records = [];
  let id = 1;
  for (const [empId, days] of Object.entries(JUNE_ATTENDANCE_DAYS)) {
    for (const day of days) {
      records.push({
        id: id++,
        employeeId: Number(empId),
        workDate: `2026-06-${String(day).padStart(2, '0')}T00:00:00.000Z`,
        entryTime: '08:00',
        exitTime: day % 3 === 0 ? '17:00' : null,
        source: 'manual',
      });
    }
  }
  // Июль 2026: сегодня 1 июля — все пришли
  for (const emp of EMPLOYEES) {
    records.push({
      id: id++,
      employeeId: emp.id,
      workDate: '2026-07-01T00:00:00.000Z',
      entryTime: '08:00',
      exitTime: null,
      source: 'camera',
    });
  }
  return records;
}

let ATTENDANCE = buildAttendanceRecords();

// Camera events
const CAMERA_EVENTS = [
  { id: 1, cameraId: 1, location: 'Въезд КПП-1',  plate: 'KG 0012 AB', direction: 'entry', isAuth: true,  orderNo: 'ORD-0041', createdAt: new Date(Date.now() - 2*60000).toISOString() },
  { id: 2, cameraId: 2, location: 'Выезд КПП-2',  plate: 'KG 1543 CD', direction: 'exit',  isAuth: true,  orderNo: null,       createdAt: new Date(Date.now() - 5*60000).toISOString() },
  { id: 3, cameraId: 3, location: 'Склад ГСМ',    plate: 'B 1234 XX',  direction: 'entry', isAuth: false, orderNo: null,       createdAt: new Date(Date.now() - 8*60000).toISOString() },
  { id: 4, cameraId: 1, location: 'Въезд КПП-1',  plate: 'KG 7723 EF', direction: 'entry', isAuth: true,  orderNo: 'ORD-0039', createdAt: new Date(Date.now() - 15*60000).toISOString() },
  { id: 5, cameraId: 2, location: 'Выезд КПП-2',  plate: 'KG 3312 GH', direction: 'exit',  isAuth: true,  orderNo: null,       createdAt: new Date(Date.now() - 22*60000).toISOString() },
];

const CAMERA_STATS = { entries: 8, exits: 6, authorized: 12, denied: 2 };

// Расчёт зарплат
function calcSalaries(year, month) {
  const TOTAL_WORK_DAYS = month === 6 ? 22 : month === 7 ? 23 : 22;
  return EMPLOYEES.map(emp => {
    const worked = ATTENDANCE.filter(r => {
      const d = new Date(r.workDate);
      return r.employeeId === emp.id && d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
    }).length;
    const amount = Math.round(Number(emp.baseSalary) * worked / TOTAL_WORK_DAYS);
    return { employeeId: emp.id, amount, daysWorked: worked, isFinal: month < 7 };
  });
}

function calcYearlySalaries(year) {
  const byEmployee = {};
  for (const emp of EMPLOYEES) {
    byEmployee[emp.id] = {};
    for (let m = 1; m <= 12; m++) {
      const TOTAL_WORK_DAYS = 22;
      const worked = ATTENDANCE.filter(r => {
        const d = new Date(r.workDate);
        return r.employeeId === emp.id && d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === m;
      }).length;
      if (worked > 0) {
        byEmployee[emp.id][m] = Math.round(Number(emp.baseSalary) * worked / TOTAL_WORK_DAYS);
      }
    }
  }
  return byEmployee;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(raw.split(';').map(c => {
    const [k, ...v] = c.trim().split('=');
    return [k, v.join('=')];
  }));
}

function getUserFromCookie(req) {
  const cookies = parseCookies(req);
  const token = cookies['vertex_token'];
  if (!token || !token.startsWith('uid_')) return null;
  const id = Number(token.slice(4));
  return USERS.find(u => u.id === id) || null;
}

// ─── Request helpers ──────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((res, rej) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { res(body ? JSON.parse(body) : {}); } catch { res({}); }
    });
    req.on('error', rej);
  });
}

function send(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function parseQuery(url) {
  const idx = url.indexOf('?');
  if (idx === -1) return {};
  return Object.fromEntries(new URLSearchParams(url.slice(idx + 1)));
}

// ─── Router ───────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const path = (req.url || '/').split('?')[0];
  const method = req.method || 'GET';
  const query = parseQuery(req.url || '');

  // Health
  if (path === '/api/health') {
    return send(res, 200, { ok: true, time: new Date().toISOString() });
  }

  // Auth: me
  if (path === '/api/auth/me' && method === 'GET') {
    const u = getUserFromCookie(req);
    if (!u) return send(res, 401, { error: 'Не авторизован' });
    return send(res, 200, { user: { id: u.id, login: u.login, name: u.name, role: u.role } });
  }

  // Auth: login
  if (path === '/api/auth/login' && method === 'POST') {
    const body = await readBody(req);
    const u = USERS.find(x => x.login === body.login);
    if (!u) return send(res, 401, { error: 'Неверный логин или пароль' });
    // Accept any password in demo mode, or check real password
    const cookieVal = `uid_${u.id}`;
    res.setHeader('Set-Cookie', `vertex_token=${cookieVal}; Path=/; HttpOnly; SameSite=Lax`);
    return send(res, 200, { user: { id: u.id, login: u.login, name: u.name, role: u.role } });
  }

  // Auth: logout
  if (path === '/api/auth/logout' && method === 'POST') {
    res.setHeader('Set-Cookie', 'vertex_token=; Path=/; HttpOnly; Max-Age=0');
    return send(res, 200, { ok: true });
  }

  // Employees
  if (path === '/api/employees' && method === 'GET') {
    return send(res, 200, { employees: EMPLOYEES });
  }

  // Cameras: log
  if (path === '/api/cameras/log' && method === 'GET') {
    const limit = Number(query.limit) || 50;
    return send(res, 200, { events: CAMERA_EVENTS.slice(0, limit) });
  }

  // Cameras: stats
  if (path === '/api/cameras/stats' && method === 'GET') {
    return send(res, 200, CAMERA_STATS);
  }

  // Attendance: list
  if (path === '/api/attendance' && method === 'GET') {
    const year = Number(query.year) || 2026;
    const month = Number(query.month) || 7;
    const records = ATTENDANCE.filter(r => {
      const d = new Date(r.workDate);
      return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
    });
    return send(res, 200, { records });
  }

  // Attendance: toggle
  if (path === '/api/attendance/toggle' && method === 'POST') {
    const body = await readBody(req);
    const { employeeId, year, month, day } = body;
    const workDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`;
    const idx = ATTENDANCE.findIndex(r =>
      r.employeeId === employeeId && r.workDate === workDate
    );
    if (idx !== -1) {
      ATTENDANCE.splice(idx, 1);
      return send(res, 200, { removed: true });
    }
    const newRec = { id: Date.now(), employeeId, workDate, entryTime: '08:00', exitTime: null, source: 'manual' };
    ATTENDANCE.push(newRec);
    return send(res, 200, { record: newRec });
  }

  // Salaries: month
  if (path === '/api/salaries/month' && method === 'GET') {
    const year = Number(query.year) || 2026;
    const month = Number(query.month) || 7;
    return send(res, 200, { rows: calcSalaries(year, month) });
  }

  // Salaries: year
  if (path === '/api/salaries/year' && method === 'GET') {
    const year = Number(query.year) || 2026;
    return send(res, 200, { byEmployee: calcYearlySalaries(year) });
  }

  // 404
  send(res, 404, { error: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n✓ VERTEX ERP Mock API запущен на http://localhost:${PORT}`);
  console.log(`\n  Логины для демо:`);
  for (const u of USERS) {
    console.log(`    ${u.login.padEnd(12)} / ${u.password}   (${u.role})`);
  }
  console.log(`\n  Теперь запусти: npm run dev  (в папке apps/web)`);
  console.log(`  Сайт:           http://localhost:3000\n`);
});
