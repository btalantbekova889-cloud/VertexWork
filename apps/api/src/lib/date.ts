const TZ = 'Asia/Bishkek';

export function todayDateOnly(): Date {
  const ymd = new Date().toLocaleDateString('en-CA', { timeZone: TZ }); // YYYY-MM-DD
  return new Date(`${ymd}T00:00:00.000Z`);
}

export function dateOnly(year: number, month: number, day: number): Date {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return new Date(`${year}-${mm}-${dd}T00:00:00.000Z`);
}

export function nowTimeHHMM(): string {
  return new Date().toLocaleTimeString('ru-RU', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
}

export function workingDaysInMonth(year: number, month: number): number {
  const days = new Date(year, month, 0).getDate();
  let count = 0;
  for (let d = 1; d <= days; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}
