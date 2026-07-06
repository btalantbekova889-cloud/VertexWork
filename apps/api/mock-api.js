/**
 * VERTEX ERP — Mock API (без базы данных)
 *
 * Запуск:  node apps/api/mock-api.js
 * Затем:   npm run dev  (в apps/web)
 * Сайт:    http://localhost:3000
 */

const http = require('http');
const PORT = 4000;

// ─── Users ────────────────────────────────────────────────────────────────────

const USERS = [
  { id:  1, login: 'director',     password: 'director2026',     name: 'Асылбек Марупов',        role: 'director' },
  { id:  2, login: 'coo',          password: 'coo2026',          name: 'Канатбек Осмонов',       role: 'coo' },
  { id:  3, login: 'commercial',   password: 'commercial2026',   name: 'Нуржан Бейсенов',        role: 'commercial_director' },
  { id:  4, login: 'sales',        password: 'sales2026',        name: 'Санжар Кудайбергенов',   role: 'sales_manager' },
  { id:  5, login: 'tender',       password: 'tender2026',       name: 'Мирлан Токтосунов',      role: 'tender_specialist' },
  { id:  6, login: 'marketer',     password: 'marketer2026',     name: 'Айбек Жумабеков',        role: 'marketer' },
  { id:  7, login: 'smm',          password: 'smm2026',          name: 'Жазира Нурлан',          role: 'smm_manager' },
  { id:  8, login: 'content',      password: 'content2026',      name: 'Асель Бекова',           role: 'content_marketer' },
  { id:  9, login: 'logist',       password: 'logist2026',       name: 'Руслан Ахметов',         role: 'logist' },
  { id: 10, login: 'findirector',  password: 'findirector2026',  name: 'Гульнара Сатыбалдиева',  role: 'financial_director' },
  { id: 11, login: 'accountant',   password: 'accountant2026',   name: 'Айгуль Жаксыбекова',    role: 'accountant' },
  { id: 12, login: 'zakup',        password: 'zakup2026',        name: 'Эрик Абдиев',            role: 'purchaser' },
  { id: 13, login: 'lawyer',       password: 'lawyer2026',       name: 'Камила Дюшенова',        role: 'lawyer' },
  { id: 14, login: 'hr',           password: 'hr2026',           name: 'Данияр Асылбеков',       role: 'hr' },
  { id: 15, login: 'admin',        password: 'admin2026',        name: 'Гүлзат Эркинова',        role: 'office_admin' },
  { id: 16, login: 'it',           password: 'it2026',           name: 'Тимур Садыков',          role: 'it_specialist' },
  { id: 17, login: 'operator',     password: 'operator2026',     name: 'Айнур Кенжебаева',       role: 'operator' },
  { id: 18, login: 'proddirector', password: 'proddirector2026', name: 'Алмаз Темиров',          role: 'production_director' },
  { id: 19, login: 'quarry',       password: 'quarry2026',       name: 'Болат Ержанов',          role: 'quarry_manager' },
  { id: 20, login: 'loghead',      password: 'loghead2026',      name: 'Серик Маратов',          role: 'logistics_head' },
];

// ─── Employees ────────────────────────────────────────────────────────────────

let EMPLOYEES = [
  { id: 1,  name: 'Ержанов Болат',      fullName: 'Ержанов Болат',      dept: 'Производство', position: 'Оператор экскаватора', hired: '02.06.2021', status: 'active',    vacation: null,        baseSalary: 70000,  plate: { plate: 'KG 0012 AB', vehicle: 'КАМАЗ-65115' } },
  { id: 2,  name: 'Темиров Алмас',      fullName: 'Темиров Алмас',      dept: 'Логистика',    position: 'Водитель самосвала',   hired: '12.03.2023', status: 'active',    vacation: 'Июль 2026', baseSalary: 65000,  plate: { plate: 'KG 1543 CD', vehicle: 'Volvo FH16' } },
  { id: 3,  name: 'Касымов Нурлан',     fullName: 'Касымов Нурлан',     dept: 'Производство', position: 'Механик',              hired: '05.01.2023', status: 'active',    vacation: null,        baseSalary: 75000,  plate: null },
  { id: 4,  name: 'Асылбеков Данияр',   fullName: 'Асылбеков Данияр',   dept: 'Производство', position: 'Инженер-геолог',       hired: '15.11.2022', status: 'active',    vacation: null,        baseSalary: 90000,  plate: { plate: 'KG 7723 EF', vehicle: 'Toyota Land Cruiser 200' } },
  { id: 5,  name: 'Жаксыбекова Айгуль', fullName: 'Жаксыбекова Айгуль', dept: 'Финансы',      position: 'Бухгалтер',            hired: '01.04.2022', status: 'active',    vacation: null,        baseSalary: 80000,  plate: null },
  { id: 6,  name: 'Маратов Серик',      fullName: 'Маратов Серик',      dept: 'Охрана',       position: 'Охранник КПП',         hired: '08.08.2023', status: 'active',    vacation: null,        baseSalary: 55000,  plate: { plate: 'KG 3312 GH', vehicle: 'ВАЗ-21099' } },
  { id: 7,  name: 'Дуйсенов Берик',     fullName: 'Дуйсенов Берик',     dept: 'Производство', position: 'Геодезист',            hired: '22.05.2023', status: 'active',    vacation: null,        baseSalary: 85000,  plate: null },
  { id: 8,  name: 'Сейтов Дамир',       fullName: 'Сейтов Дамир',       dept: 'HR',           position: 'HR-менеджер',          hired: '15.11.2022', status: 'active',    vacation: null,        baseSalary: 80000,  plate: null },
  { id: 9,  name: 'Байжанов Серик',     fullName: 'Байжанов Серик',     dept: 'Охрана',       position: 'Охранник',             hired: '08.08.2023', status: 'active',    vacation: null,        baseSalary: 55000,  plate: null },
  { id: 10, name: 'Жаксыбеков Айдан',   fullName: 'Жаксыбеков Айдан',   dept: 'Логистика',    position: 'Водитель',             hired: '14.10.2023', status: 'probation', vacation: null,        baseSalary: 50000,  plate: null },
];
let nextEmployeeId = 11;

// ─── Clients ──────────────────────────────────────────────────────────────────

let CLIENTS = [
  { id: 1, name: 'ТОО "АлтайСтрой"',  contact: 'Иванов П.С.',   phone: '+7 777 123-45-67', city: 'Алматы', orders: 47, totalAmount: 18400000, debt: 0,       status: 'active' },
  { id: 2, name: 'АО "СтройКонсалт"',  contact: 'Петрова М.А.',  phone: '+7 701 987-65-43', city: 'Алматы', orders: 32, totalAmount: 14200000, debt: 1050000, status: 'active' },
  { id: 3, name: 'ТОО "МегаБуд"',      contact: 'Асанов К.Т.',   phone: '+7 747 555-33-22', city: 'Алматы', orders: 18, totalAmount: 6800000,  debt: 780000,  status: 'active' },
  { id: 4, name: 'ИП Казаков В.С.',     contact: 'Казаков В.С.',  phone: '+7 712 444-22-11', city: 'Алматы', orders: 12, totalAmount: 3200000,  debt: 296000,  status: 'active' },
  { id: 5, name: 'ТОО "КаменьСтрой"',  contact: 'Бекова Р.Н.',   phone: '+7 778 666-44-33', city: 'Алматы', orders: 8,  totalAmount: 2800000,  debt: 2800000, status: 'blocked' },
  { id: 6, name: 'ТОО "НурБетон"',     contact: 'Жаксыбеков А.', phone: '+7 700 111-22-33', city: 'Бишкек', orders: 5,  totalAmount: 1200000,  debt: 0,       status: 'active' },
];
let nextClientId = 7;

// ─── Orders ───────────────────────────────────────────────────────────────────

let ORDERS = [
  { id: 1, orderId: 'ОРД-2847', client: 'ТОО "АлтайСтрой"',  manager: 'Касымова А.', material: 'Щебень фр.20-40', volume: 120, price: 4000, status: 'delivered',   date: '29.06.2026' },
  { id: 2, orderId: 'ОРД-2846', client: 'ИП Казаков В.С.',    manager: 'Сейтов Д.',   material: 'Щебень фр.5-20',  volume: 80,  price: 3700, status: 'in_progress', date: '29.06.2026' },
  { id: 3, orderId: 'ОРД-2845', client: 'ТОО "МегаБуд"',      manager: 'Касымова А.', material: 'Отсев',           volume: 200, price: 1800, status: 'pending',     date: '28.06.2026' },
  { id: 4, orderId: 'ОРД-2844', client: 'АО "СтройКонсалт"',  manager: 'Нурланов Е.', material: 'Щебень фр.40-70', volume: 300, price: 3500, status: 'delivered',   date: '28.06.2026' },
  { id: 5, orderId: 'ОРД-2843', client: 'ТОО "НурБетон"',     manager: 'Касымова А.', material: 'Щебень фр.20-40', volume: 150, price: 4000, status: 'cancelled',   date: '27.06.2026' },
];
let nextOrderId = 6;
let nextOrderNum = 2848;

// ─── Tenders ──────────────────────────────────────────────────────────────────

let TENDERS = [
  { id: 1, tenderId: 'Т-2026-041', name: 'Поставка щебня фр. 20-40 для ГДТС КР',      volume: '5 000 т',  amount: '1 500 000 сом', deadline: '15.07.2026', status: 'active' },
  { id: 2, tenderId: 'Т-2026-038', name: 'Отсев для дорожных работ — Бишкек ГСК',      volume: '3 200 т',  amount: '640 000 сом',   deadline: '10.07.2026', status: 'active' },
  { id: 3, tenderId: 'Т-2026-032', name: 'Щебень фр. 5-20 для ОсОО СтройГрупп',       volume: '8 000 т',  amount: '2 400 000 сом', deadline: '30.06.2026', status: 'won' },
  { id: 4, tenderId: 'Т-2026-029', name: 'Песок строительный — тендер Минтранса',      volume: '2 000 т',  amount: '300 000 сом',   deadline: '20.06.2026', status: 'lost' },
  { id: 5, tenderId: 'Т-2026-025', name: 'Инертные материалы для ОФ Кумтор',           volume: '12 000 т', amount: '3 600 000 сом', deadline: '01.06.2026', status: 'won' },
];
let nextTenderId = 6;
let nextTenderNum = 42;

// ─── Vehicles ─────────────────────────────────────────────────────────────────

let VEHICLES = [
  { id: 1, plate: 'A 147 KG', driver: 'Нурланов Е.',     capacity: 30, status: 'on_route',    order: 'ОРД-2847', eta: '14:30' },
  { id: 2, plate: 'B 234 KG', driver: 'Жаксыбеков А.',   capacity: 28, status: 'loading',     order: 'ОРД-2846', eta: '—' },
  { id: 3, plate: 'C 089 KG', driver: 'Темиров К.',       capacity: 32, status: 'available',   order: null,       eta: '—' },
  { id: 4, plate: 'D 456 KG', driver: 'Сатыбалдиев О.',  capacity: 28, status: 'available',   order: null,       eta: '—' },
  { id: 5, plate: 'E 778 KG', driver: 'Алиев Р.',         capacity: 30, status: 'maintenance', order: null,       eta: '—' },
];

// ─── Repair requests ──────────────────────────────────────────────────────────

let REPAIR_REQUESTS = [];
let nextRepairId = 1;

// ─── Security passes ──────────────────────────────────────────────────────────

let PASSES = [
  { id: 1, time: '09:45', vehicle: 'A 147 KG', driver: 'Нурланов Е.',     type: 'exit',  order: 'ОРД-2847', weight: '53.4 т', approved: 'Байжанов С.' },
  { id: 2, time: '09:30', vehicle: 'D 456 KG', driver: 'Сатыбалдиев О.', type: 'entry', order: 'ОРД-2845', weight: '24.2 т', approved: 'Байжанов С.' },
  { id: 3, time: '09:15', vehicle: 'B 234 KG', driver: 'Жаксыбеков А.',   type: 'entry', order: 'ОРД-2846', weight: '24.6 т', approved: 'Байжанов С.' },
  { id: 4, time: '09:00', vehicle: 'C 089 KG', driver: 'Темиров К.',       type: 'exit',  order: 'ОРД-2848', weight: '58.1 т', approved: 'Байжанов С.' },
  { id: 5, time: '08:45', vehicle: 'F 321 KG', driver: 'Алиев Р.',         type: 'exit',  order: 'ОРД-2844', weight: '55.2 т', approved: 'Байжанов С.' },
  { id: 6, time: '08:30', vehicle: 'A 147 KG', driver: 'Нурланов Е.',     type: 'entry', order: 'ОРД-2847', weight: '24.2 т', approved: 'Байжанов С.' },
];
let nextPassId = 7;

// ─── Visitors ─────────────────────────────────────────────────────────────────

let VISITORS = [
  { id: 1, name: 'Петров А.В.',   company: 'ТОО "АлтайСтрой"',    purpose: 'Проверка груза', in: '09:00', out: null,    pass: 'ВП-0445' },
  { id: 2, name: 'Иванова М.С.', company: 'Налоговая инспекция',  purpose: 'Проверка',       in: '10:30', out: null,    pass: 'ВП-0446' },
  { id: 3, name: 'Сидоров К.П.', company: 'АО "СтройКонсалт"',   purpose: 'Самовывоз',      in: '08:15', out: '08:55', pass: 'ВП-0444' },
];
let nextVisitorId = 4;
let nextVisitorPass = 447;

// ─── Weighings ────────────────────────────────────────────────────────────────

let WEIGHINGS = [
  { id: 1, weighId: 'ВС-4525', vehicle: 'A 147 KG', driver: 'Нурланов Е.',    order: 'ОРД-2847', material: 'Щебень фр.20-40', gross: 53.4, tare: 24.2, net: 29.2, time: '08:45', status: 'done' },
  { id: 2, weighId: 'ВС-4524', vehicle: 'B 234 KG', driver: 'Жаксыбеков А.',  order: 'ОРД-2846', material: 'Щебень фр.5-20',  gross: 54.8, tare: 24.6, net: 30.2, time: '08:30', status: 'done' },
  { id: 3, weighId: 'ВС-4523', vehicle: 'C 089 KG', driver: 'Темиров К.',      order: 'ОРД-2848', material: 'Щебень фр.20-40', gross: 58.1, tare: 25.4, net: 32.7, time: '08:15', status: 'done' },
  { id: 4, weighId: 'ВС-4522', vehicle: 'D 456 KG', driver: 'Сатыбалдиев О.', order: 'ОРД-2845', material: 'Отсев',           gross: 51.2, tare: 23.8, net: 27.4, time: '07:55', status: 'done' },
];
let nextWeighingId = 5;
let nextWeighingNum = 4526;

// ─── Documents ────────────────────────────────────────────────────────────────

let DOCUMENTS = [
  { id: 1, docId: 'СЧТ-2847',    type: 'Счет',        client: 'ТОО "АлтайСтрой"', amount: 480000,  date: '29.06.2026', status: 'paid',      ext: 'PDF' },
  { id: 2, docId: 'АКТ-2847',    type: 'Акт',         client: 'ТОО "АлтайСтрой"', amount: 480000,  date: '29.06.2026', status: 'signed',    ext: 'PDF' },
  { id: 3, docId: 'НТ-12233',    type: 'Накладная',   client: 'ТОО "АлтайСтрой"', amount: 480000,  date: '29.06.2026', status: 'issued',    ext: 'PDF' },
  { id: 4, docId: 'СЧТ-2846',    type: 'Счет',        client: 'ИП Казаков В.С.',   amount: 296000,  date: '29.06.2026', status: 'pending',   ext: 'PDF' },
  { id: 5, docId: 'АКТ-2844',    type: 'Акт',         client: 'АО "СтройКонсалт"', amount: 1050000, date: '28.06.2026', status: 'signed',    ext: 'PDF' },
  { id: 6, docId: 'СЧТ-2844',    type: 'Счет',        client: 'АО "СтройКонсалт"', amount: 1050000, date: '28.06.2026', status: 'paid',      ext: 'PDF' },
  { id: 7, docId: 'ДОГ-2026-047',type: 'Договор',     client: 'ТОО "НурБетон"',    amount: null,    date: '25.06.2026', status: 'active',    ext: 'DOCX' },
  { id: 8, docId: 'НО-2026-06',  type: 'Налог. отчет',client: null,                amount: null,    date: '20.06.2026', status: 'submitted', ext: 'PDF' },
];
let nextDocId = 9;
let nextDocNum = 2848;

// ─── Attendance ───────────────────────────────────────────────────────────────

const JUNE_WORK_DAYS = [1,2,3,4,5, 8,9,10,11,12, 15,16,17,18,19, 22,23,24,25,26, 29,30];
const JUNE_ATTENDANCE_DAYS = {
  1: JUNE_WORK_DAYS,
  2: JUNE_WORK_DAYS.filter(d => d !== 15),
  3: JUNE_WORK_DAYS.filter(d => d !== 10 && d !== 26),
  4: JUNE_WORK_DAYS,
  5: JUNE_WORK_DAYS,
  6: JUNE_WORK_DAYS.filter(d => d > 8),
  7: JUNE_WORK_DAYS.filter(d => d !== 3),
};

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
  for (const emp of EMPLOYEES.slice(0, 7)) {
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

// ─── Camera events ────────────────────────────────────────────────────────────

const CAMERA_EVENTS = [
  { id: 1, cameraId: 1, location: 'Въезд КПП-1',  plate: 'KG 0012 AB', direction: 'entry', isAuth: true,  orderNo: 'ORD-0041', createdAt: new Date(Date.now() - 2*60000).toISOString() },
  { id: 2, cameraId: 2, location: 'Выезд КПП-2',  plate: 'KG 1543 CD', direction: 'exit',  isAuth: true,  orderNo: null,       createdAt: new Date(Date.now() - 5*60000).toISOString() },
  { id: 3, cameraId: 3, location: 'Склад ГСМ',    plate: 'B 1234 XX',  direction: 'entry', isAuth: false, orderNo: null,       createdAt: new Date(Date.now() - 8*60000).toISOString() },
  { id: 4, cameraId: 1, location: 'Въезд КПП-1',  plate: 'KG 7723 EF', direction: 'entry', isAuth: true,  orderNo: 'ORD-0039', createdAt: new Date(Date.now() - 15*60000).toISOString() },
  { id: 5, cameraId: 2, location: 'Выезд КПП-2',  plate: 'KG 3312 GH', direction: 'exit',  isAuth: true,  orderNo: null,       createdAt: new Date(Date.now() - 22*60000).toISOString() },
];
const CAMERA_STATS = { entries: 8, exits: 6, authorized: 12, denied: 2 };

// ─── Salary calculations ──────────────────────────────────────────────────────

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
      if (worked > 0) byEmployee[emp.id][m] = Math.round(Number(emp.baseSalary) * worked / TOTAL_WORK_DAYS);
    }
  }
  return byEmployee;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

function parseQuery(url) {
  const idx = url.indexOf('?');
  if (idx === -1) return {};
  return Object.fromEntries(new URLSearchParams(url.slice(idx + 1)));
}

function pathId(path, prefix) {
  if (!path.startsWith(prefix + '/')) return null;
  const id = Number(path.slice(prefix.length + 1).split('/')[0]);
  return isNaN(id) ? null : id;
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

  // ── Auth ────────────────────────────────────────────────────────────────────
  if (path === '/api/auth/me' && method === 'GET') {
    const u = getUserFromCookie(req);
    if (!u) return send(res, 401, { error: 'Не авторизован' });
    return send(res, 200, { user: { id: u.id, login: u.login, name: u.name, role: u.role } });
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const body = await readBody(req);
    const u = USERS.find(x => x.login === body.login);
    if (!u) return send(res, 401, { error: 'Неверный логин или пароль' });
    res.setHeader('Set-Cookie', `vertex_token=uid_${u.id}; Path=/; HttpOnly; SameSite=Lax`);
    return send(res, 200, { user: { id: u.id, login: u.login, name: u.name, role: u.role } });
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    res.setHeader('Set-Cookie', 'vertex_token=; Path=/; HttpOnly; Max-Age=0');
    return send(res, 200, { ok: true });
  }

  // ── Employees ───────────────────────────────────────────────────────────────
  if (path === '/api/employees' && method === 'GET') {
    return send(res, 200, { employees: EMPLOYEES });
  }

  if (path === '/api/employees' && method === 'POST') {
    const body = await readBody(req);
    const today = new Date().toLocaleDateString('ru-RU');
    const emp = {
      id: nextEmployeeId++,
      name: (body.name || '').trim(),
      fullName: (body.name || '').trim(),
      dept: body.dept || 'Производство',
      position: (body.position || '').trim(),
      hired: body.hired || today,
      status: body.status || 'active',
      vacation: null,
      baseSalary: Number(body.baseSalary) || 50000,
      plate: null,
    };
    EMPLOYEES.push(emp);
    return send(res, 201, { employee: emp });
  }

  const empId = pathId(path, '/api/employees');
  if (empId !== null && method === 'DELETE') {
    const idx = EMPLOYEES.findIndex(e => e.id === empId);
    if (idx !== -1) EMPLOYEES.splice(idx, 1);
    return send(res, 200, { ok: true });
  }

  if (empId !== null && method === 'PATCH') {
    const body = await readBody(req);
    const emp = EMPLOYEES.find(e => e.id === empId);
    if (emp) Object.assign(emp, body);
    return send(res, 200, { employee: emp });
  }

  // ── Clients ─────────────────────────────────────────────────────────────────
  if (path === '/api/clients' && method === 'GET') {
    return send(res, 200, { clients: CLIENTS });
  }

  if (path === '/api/clients' && method === 'POST') {
    const body = await readBody(req);
    const client = {
      id: nextClientId++,
      name: (body.name || '').trim(),
      contact: (body.contact || '').trim(),
      phone: (body.phone || '').trim(),
      city: (body.city || '').trim(),
      orders: 0,
      totalAmount: 0,
      debt: 0,
      status: body.status || 'active',
    };
    CLIENTS.push(client);
    return send(res, 201, { client });
  }

  const clientId = pathId(path, '/api/clients');
  if (clientId !== null && method === 'DELETE') {
    const idx = CLIENTS.findIndex(c => c.id === clientId);
    if (idx !== -1) CLIENTS.splice(idx, 1);
    return send(res, 200, { ok: true });
  }

  if (clientId !== null && method === 'PATCH') {
    const body = await readBody(req);
    const client = CLIENTS.find(c => c.id === clientId);
    if (client) Object.assign(client, body);
    return send(res, 200, { client });
  }

  // ── Orders ──────────────────────────────────────────────────────────────────
  if (path === '/api/orders' && method === 'GET') {
    return send(res, 200, { orders: ORDERS });
  }

  if (path === '/api/orders' && method === 'POST') {
    const body = await readBody(req);
    const order = {
      id: nextOrderId++,
      orderId: `ОРД-${nextOrderNum++}`,
      client: (body.client || '').trim(),
      manager: (body.manager || '').trim(),
      material: body.material || 'Щебень фр.20-40',
      volume: Number(body.volume) || 0,
      price: Number(body.price) || 0,
      status: body.status || 'pending',
      date: new Date().toLocaleDateString('ru-RU'),
    };
    ORDERS.unshift(order);
    return send(res, 201, { order });
  }

  const orderId = pathId(path, '/api/orders');
  if (orderId !== null && method === 'DELETE') {
    const idx = ORDERS.findIndex(o => o.id === orderId);
    if (idx !== -1) ORDERS.splice(idx, 1);
    return send(res, 200, { ok: true });
  }

  if (orderId !== null && method === 'PATCH') {
    const body = await readBody(req);
    const order = ORDERS.find(o => o.id === orderId);
    if (order) Object.assign(order, body);
    return send(res, 200, { order });
  }

  // ── Tenders ─────────────────────────────────────────────────────────────────
  if (path === '/api/tenders' && method === 'GET') {
    return send(res, 200, { tenders: TENDERS });
  }

  if (path === '/api/tenders' && method === 'POST') {
    const body = await readBody(req);
    const tender = {
      id: nextTenderId++,
      tenderId: `Т-2026-${String(nextTenderNum++).padStart(3, '0')}`,
      name: (body.name || '').trim(),
      volume: (body.volume || '').trim(),
      amount: (body.amount || '').trim(),
      deadline: (body.deadline || '').trim(),
      status: body.status || 'active',
    };
    TENDERS.unshift(tender);
    return send(res, 201, { tender });
  }

  const tenderId = pathId(path, '/api/tenders');
  if (tenderId !== null && method === 'DELETE') {
    const idx = TENDERS.findIndex(t => t.id === tenderId);
    if (idx !== -1) TENDERS.splice(idx, 1);
    return send(res, 200, { ok: true });
  }

  // ── Vehicles ─────────────────────────────────────────────────────────────────
  if (path === '/api/vehicles' && method === 'GET') {
    return send(res, 200, { vehicles: VEHICLES });
  }
  const vehicleId = pathId(path, '/api/vehicles');
  if (vehicleId !== null && method === 'PATCH') {
    const body = await readBody(req);
    const v = VEHICLES.find(v => v.id === vehicleId);
    if (v) Object.assign(v, body);
    return send(res, 200, { vehicle: v });
  }

  // ── Repair requests ──────────────────────────────────────────────────────────
  if (path === '/api/repair-requests' && method === 'GET') {
    return send(res, 200, { requests: REPAIR_REQUESTS });
  }
  if (path === '/api/repair-requests' && method === 'POST') {
    const body = await readBody(req);
    const now = new Date().toLocaleString('ru-RU');
    const rr = {
      id: nextRepairId++,
      equipmentId:   (body.equipmentId   || '').trim(),
      equipmentName: (body.equipmentName || '').trim(),
      problem:       (body.problem       || '').trim(),
      priority:       body.priority      || 'normal',
      status: 'open',
      createdAt: now,
    };
    REPAIR_REQUESTS.unshift(rr);
    return send(res, 201, { request: rr });
  }

  // ── Passes ───────────────────────────────────────────────────────────────────
  if (path === '/api/passes' && method === 'GET') {
    return send(res, 200, { passes: PASSES });
  }
  if (path === '/api/passes' && method === 'POST') {
    const body = await readBody(req);
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const p = {
      id: nextPassId++,
      time: t,
      vehicle:  (body.vehicle  || '').trim().toUpperCase(),
      driver:   (body.driver   || '').trim(),
      type:      body.type     || 'entry',
      order:    (body.order    || '').trim(),
      weight:   (body.weight   || '—'),
      approved: (body.approved || 'Дежурный'),
    };
    PASSES.unshift(p);
    return send(res, 201, { pass: p });
  }

  // ── Visitors ─────────────────────────────────────────────────────────────────
  if (path === '/api/visitors' && method === 'GET') {
    return send(res, 200, { visitors: VISITORS });
  }
  if (path === '/api/visitors' && method === 'POST') {
    const body = await readBody(req);
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const vis = {
      id:      nextVisitorId++,
      name:    (body.name    || '').trim(),
      company: (body.company || '').trim(),
      purpose: (body.purpose || '').trim(),
      in:  t,
      out: null,
      pass: `ВП-0${nextVisitorPass++}`,
    };
    VISITORS.unshift(vis);
    return send(res, 201, { visitor: vis });
  }
  const visitorId = pathId(path, '/api/visitors');
  if (visitorId !== null && method === 'PATCH') {
    const body = await readBody(req);
    const vis = VISITORS.find(v => v.id === visitorId);
    if (vis) Object.assign(vis, body);
    return send(res, 200, { visitor: vis });
  }

  // ── Weighings ────────────────────────────────────────────────────────────────
  if (path === '/api/weighings' && method === 'GET') {
    return send(res, 200, { weighings: WEIGHINGS });
  }
  if (path === '/api/weighings' && method === 'POST') {
    const body = await readBody(req);
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const gross = Number(body.gross) || 0;
    const tare  = Number(body.tare)  || 0;
    const w = {
      id:      nextWeighingId++,
      weighId: `ВС-${nextWeighingNum++}`,
      vehicle:  (body.vehicle  || '').trim().toUpperCase(),
      driver:   (body.driver   || '').trim(),
      order:    (body.order    || '').trim(),
      material:  body.material || 'Щебень фр.20-40',
      gross, tare,
      net: Math.max(0, +(gross - tare).toFixed(1)),
      time: t,
      status: 'done',
    };
    WEIGHINGS.unshift(w);
    return send(res, 201, { weighing: w });
  }

  // ── Documents ─────────────────────────────────────────────────────────────────
  if (path === '/api/documents' && method === 'GET') {
    return send(res, 200, { documents: DOCUMENTS });
  }
  if (path === '/api/documents' && method === 'POST') {
    const body = await readBody(req);
    const today = new Date().toLocaleDateString('ru-RU');
    const doc = {
      id:     nextDocId++,
      docId:  `СЧТ-${nextDocNum++}`,
      type:    body.type   || 'Счет',
      client: (body.client || '').trim() || null,
      amount:  body.amount ? Number(body.amount) : null,
      date:    today,
      status: 'pending',
      ext:    'PDF',
    };
    DOCUMENTS.unshift(doc);
    return send(res, 201, { document: doc });
  }

  // ── Attendance mark (ручная отметка начальника карьера) ───────────────────────
  if (path === '/api/attendance/mark' && method === 'POST') {
    const body = await readBody(req);
    const { employeeId, action } = body;
    const now = new Date();
    const workDate = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}-${String(now.getUTCDate()).padStart(2,'0')}T00:00:00.000Z`;
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    let rec = ATTENDANCE.find(r => r.employeeId === employeeId && r.workDate === workDate);
    if (action === 'entry') {
      if (rec) { rec.entryTime = timeStr; }
      else { rec = { id: Date.now(), employeeId, workDate, entryTime: timeStr, exitTime: null, source: 'manual' }; ATTENDANCE.push(rec); }
      return send(res, 200, { record: rec });
    }
    if (action === 'exit') {
      if (!rec) return send(res, 400, { error: 'Нет записи о въезде' });
      rec.exitTime = timeStr;
      return send(res, 200, { record: rec });
    }
    if (action === 'remove') {
      const idx = ATTENDANCE.findIndex(r => r.employeeId === employeeId && r.workDate === workDate);
      if (idx !== -1) ATTENDANCE.splice(idx, 1);
      return send(res, 200, { removed: true });
    }
    return send(res, 400, { error: 'Unknown action' });
  }

  // ── Cameras ─────────────────────────────────────────────────────────────────
  if (path === '/api/cameras/log' && method === 'GET') {
    const limit = Number(query.limit) || 50;
    return send(res, 200, { events: CAMERA_EVENTS.slice(0, limit) });
  }

  if (path === '/api/cameras/stats' && method === 'GET') {
    return send(res, 200, CAMERA_STATS);
  }

  // ── Attendance ──────────────────────────────────────────────────────────────
  if (path === '/api/attendance' && method === 'GET') {
    const year = Number(query.year) || 2026;
    const month = Number(query.month) || 7;
    const records = ATTENDANCE.filter(r => {
      const d = new Date(r.workDate);
      return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
    });
    return send(res, 200, { records });
  }

  if (path === '/api/attendance/toggle' && method === 'POST') {
    const body = await readBody(req);
    const { employeeId, year, month, day } = body;
    const workDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`;
    const idx = ATTENDANCE.findIndex(r => r.employeeId === employeeId && r.workDate === workDate);
    if (idx !== -1) {
      ATTENDANCE.splice(idx, 1);
      return send(res, 200, { removed: true });
    }
    const newRec = { id: Date.now(), employeeId, workDate, entryTime: '08:00', exitTime: null, source: 'manual' };
    ATTENDANCE.push(newRec);
    return send(res, 200, { record: newRec });
  }

  // ── Salaries ─────────────────────────────────────────────────────────────────
  if (path === '/api/salaries/month' && method === 'GET') {
    const year = Number(query.year) || 2026;
    const month = Number(query.month) || 7;
    return send(res, 200, { rows: calcSalaries(year, month) });
  }

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
  const groups = [
    ['Руководство',        USERS.slice(0, 2)],
    ['Коммерческий блок',  USERS.slice(2, 9)],
    ['Финансы и юристы',   USERS.slice(9, 13)],
    ['Персонал и ИТ',      USERS.slice(13, 17)],
    ['Производство',       USERS.slice(17, 20)],
  ];
  for (const [label, users] of groups) {
    console.log(`\n  [${label}]`);
    for (const u of users) {
      console.log(`    ${u.login.padEnd(14)} / ${u.password}`);
    }
  }
  console.log(`\n  Теперь запусти: npm run dev  (в apps/web)\n`);
});
