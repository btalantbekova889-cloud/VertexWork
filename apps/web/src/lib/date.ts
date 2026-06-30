const TZ = 'Asia/Bishkek';

export function todayYMD(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ });
}

export function currentYearMonth(): { year: number; month: number } {
  const [year, month] = todayYMD().split('-').map(Number);
  return { year, month };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay();
  return dow === 0 || dow === 6;
}

export const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
