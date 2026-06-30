import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

const BISHKEK_OFFSET = '+06:00';

function todayAt(hhmm: string): Date {
  const ymd = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bishkek' });
  return new Date(`${ymd}T${hhmm}:00${BISHKEK_OFFSET}`);
}

function juneDate(day: number): Date {
  const dd = String(day).padStart(2, '0');
  return new Date(`2026-06-${dd}T00:00:00.000Z`);
}

const USERS = [
  { login: 'director', password: 'director2026', name: 'Асылбек Марупов', role: 'director' },
  { login: 'commercial', password: 'commercial2026', name: 'Айгуль Касымова', role: 'commercial_director' },
  { login: 'accountant', password: 'accountant2026', name: 'Нурия Жакупова', role: 'accountant' },
  { login: 'hr', password: 'hr2026', name: 'Дамир Сейтов', role: 'hr' },
  { login: 'quarry', password: 'quarry2026', name: 'Болат Ержанов', role: 'quarry_manager' },
];

const SALARY_EMPLOYEES = [
  { key: 'ershanov', fullName: 'Ержанов Болат', position: 'Начальник карьера', baseSalary: 45000 },
  { key: 'akhmetov', fullName: 'Ахметов Рустам', position: 'Диспетчер', baseSalary: 28000 },
  { key: 'seitov', fullName: 'Сейтов Марат', position: 'Весовщик', baseSalary: 20000 },
  { key: 'nurlanov', fullName: 'Нурланов Ерлан', position: 'Водитель', baseSalary: 22000 },
  { key: 'zhaksybekov', fullName: 'Жаксыбеков Айдан', position: 'Водитель', baseSalary: 22000 },
  { key: 'kasymova', fullName: 'Касымова Айгуль', position: 'Менеджер продаж', baseSalary: 30000 },
  { key: 'zhakupova', fullName: 'Жакупова Нурия', position: 'Бухгалтер', baseSalary: 35000 },
];

const QUARRY_ONLY_EMPLOYEES = [
  { key: 'temirov', fullName: 'Темиров Канат', position: 'Водитель', baseSalary: 22000 },
  { key: 'karibekov', fullName: 'Карибеков Данияр', position: 'Водитель', baseSalary: 22000 },
  { key: 'musaev', fullName: 'Мусаев Азамат', position: 'Взрывник', baseSalary: 32000 },
  { key: 'baizhanov', fullName: 'Байжанов Серик', position: 'Механик', baseSalary: 27000 },
  { key: 'satybaldiev', fullName: 'Сатыбалдиев Омар', position: 'Водитель', baseSalary: 22000 },
];

// employeeKey -> June 2026 present-day numbers (matches apps/web salaries page mock attendance)
const JUNE_ATTENDANCE: Record<string, number[]> = {
  ershanov: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29],
  akhmetov: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29],
  seitov: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 22, 23, 24, 25, 26, 29],
  nurlanov: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29],
  zhaksybekov: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 22, 23, 24, 25, 26, 29],
  kasymova: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29],
  zhakupova: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29],
  temirov: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29],
  karibekov: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29],
  musaev: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29],
  baizhanov: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29],
  satybaldiev: [],
};

// Today (30 June 2026) check-in/out, as reported by the КПП cameras
const TODAY_CHECKPOINT: Record<string, { entry: string; exit?: string }> = {
  ershanov: { entry: '07:00' },
  akhmetov: { entry: '07:05' },
  seitov: { entry: '07:15' },
  nurlanov: { entry: '07:05', exit: '09:30' },
  zhaksybekov: { entry: '07:10', exit: '08:50' },
  temirov: { entry: '07:20' },
  karibekov: { entry: '07:25' },
  musaev: { entry: '07:10' },
  baizhanov: { entry: '07:00' },
  // satybaldiev: absent today
};

const PLATES: Record<string, { plate: string; vehicle: string }> = {
  nurlanov: { plate: 'A 147 KG', vehicle: 'КамАЗ 6520' },
  zhaksybekov: { plate: 'B 234 KG', vehicle: 'КамАЗ 6520' },
  temirov: { plate: 'C 089 KG', vehicle: 'КамАЗ 65201' },
  satybaldiev: { plate: 'D 456 KG', vehicle: 'МАЗ 6501' },
  karibekov: { plate: 'E 321 KG', vehicle: 'КамАЗ 55111' },
};

// Today's checkpoint camera log (matches apps/web cameras page mock)
const CAMERA_LOG = [
  { time: '09:45', cameraId: 1, plate: 'C 089 KG', direction: 'entry', orderNo: 'ОРД-2850', isAuth: true },
  { time: '09:30', cameraId: 2, plate: 'A 147 KG', direction: 'exit', orderNo: 'ОРД-2848', isAuth: true },
  { time: '09:10', cameraId: 1, plate: 'B 234 KG', direction: 'entry', orderNo: 'ОРД-2849', isAuth: true },
  { time: '08:55', cameraId: 1, plate: 'G 999 KG', direction: 'entry', orderNo: null, isAuth: false },
  { time: '08:40', cameraId: 2, plate: 'D 456 KG', direction: 'exit', orderNo: 'ОРД-2847', isAuth: true },
  { time: '08:20', cameraId: 1, plate: 'E 321 KG', direction: 'entry', orderNo: 'ОРД-2846', isAuth: true },
  { time: '07:55', cameraId: 2, plate: 'A 147 KG', direction: 'exit', orderNo: 'ОРД-2845', isAuth: true },
  { time: '07:40', cameraId: 1, plate: 'C 089 KG', direction: 'entry', orderNo: 'ОРД-2844', isAuth: true },
  { time: '07:20', cameraId: 2, plate: 'B 234 KG', direction: 'exit', orderNo: 'ОРД-2843', isAuth: true },
  { time: '07:05', cameraId: 1, plate: 'H 777 KG', direction: 'entry', orderNo: null, isAuth: false },
] as const;

// Finalized payroll for past months (matches apps/web salaries page mock)
const APRIL: Record<string, number> = {
  ershanov: 42000, akhmetov: 28000, seitov: 18200, nurlanov: 22000, zhaksybekov: 20000, kasymova: 30000, zhakupova: 35000,
};
const MAY: Record<string, number> = {
  ershanov: 45000, akhmetov: 28000, seitov: 20000, nurlanov: 22000, zhaksybekov: 22000, kasymova: 30000, zhakupova: 35000,
};

async function main() {
  console.log('Seeding VERTEX ERP database...');

  await prisma.cameraEvent.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.salaryRecord.deleteMany();
  await prisma.plate.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.user.create({
      data: { login: u.login, password: hash, name: u.name, role: u.role },
    });
  }

  const employeeIds: Record<string, number> = {};
  for (const e of [...SALARY_EMPLOYEES, ...QUARRY_ONLY_EMPLOYEES]) {
    const created = await prisma.employee.create({
      data: { fullName: e.fullName, position: e.position, baseSalary: e.baseSalary },
    });
    employeeIds[e.key] = created.id;
  }

  for (const [key, p] of Object.entries(PLATES)) {
    await prisma.plate.create({
      data: { plate: p.plate, vehicle: p.vehicle, employeeId: employeeIds[key] },
    });
  }

  for (const [key, days] of Object.entries(JUNE_ATTENDANCE)) {
    const employeeId = employeeIds[key];
    for (const day of days) {
      await prisma.attendance.create({
        data: { employeeId, workDate: juneDate(day), source: 'manual' },
      });
    }
  }

  for (const [key, times] of Object.entries(TODAY_CHECKPOINT)) {
    const employeeId = employeeIds[key];
    await prisma.attendance.upsert({
      where: { employeeId_workDate: { employeeId, workDate: juneDate(30) } },
      create: { employeeId, workDate: juneDate(30), entryTime: times.entry, exitTime: times.exit, source: 'camera' },
      update: { entryTime: times.entry, exitTime: times.exit, source: 'camera' },
    });
  }

  for (const ev of CAMERA_LOG) {
    await prisma.cameraEvent.create({
      data: {
        cameraId: ev.cameraId,
        location: ev.cameraId === 1 ? 'Въезд КПП №1' : 'Выезд КПП №1',
        plate: ev.plate,
        direction: ev.direction,
        isAuth: ev.isAuth,
        orderNo: ev.orderNo,
        createdAt: todayAt(ev.time),
      },
    });
  }

  for (const e of SALARY_EMPLOYEES) {
    const employeeId = employeeIds[e.key];
    await prisma.salaryRecord.create({
      data: { employeeId, year: 2026, month: 4, amount: APRIL[e.key], isFinal: true },
    });
    await prisma.salaryRecord.create({
      data: { employeeId, year: 2026, month: 5, amount: MAY[e.key], isFinal: true },
    });
  }

  console.log('Seed complete.\n');
  console.log('Login credentials:');
  for (const u of USERS) {
    console.log(`  ${u.role.padEnd(20)} login=${u.login.padEnd(12)} password=${u.password}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
