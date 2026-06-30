import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { requireRole } from '../middleware/auth';
import { dateOnly, workingDaysInMonth } from '../lib/date';

const ALLOWED = ['accountant', 'director'];

async function computeMonth(employeeId: number, baseSalary: Prisma.Decimal, year: number, month: number) {
  const from = dateOnly(year, month, 1);
  const to = dateOnly(year, month + 1, 1);
  const daysWorked = await prisma.attendance.count({
    where: { employeeId, workDate: { gte: from, lt: to } },
  });
  const norm = workingDaysInMonth(year, month);
  const amount = Math.round((Number(baseSalary) / norm) * daysWorked);
  return { amount, daysWorked };
}

const monthQuerySchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
});

const yearQuerySchema = z.object({
  year: z.coerce.number().int(),
});

const finalizeSchema = z.object({
  employeeId: z.number().int(),
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  amount: z.number().optional(),
});

export default async function salaryRoutes(app: FastifyInstance) {
  app.get('/month', { preHandler: requireRole(...ALLOWED) }, async (request, reply) => {
    const parsed = monthQuerySchema.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: 'Укажите year и month' });
    const { year, month } = parsed.data;

    const employees = await prisma.employee.findMany({ where: { isActive: true }, orderBy: { id: 'asc' } });
    const records = await prisma.salaryRecord.findMany({ where: { year, month } });
    const recordMap = new Map(records.map((r) => [r.employeeId, r]));

    const rows = await Promise.all(
      employees.map(async (emp) => {
        const final = recordMap.get(emp.id);
        if (final) {
          return { employeeId: emp.id, amount: Number(final.amount), daysWorked: final.daysWorked ?? 0, isFinal: true };
        }
        const { amount, daysWorked } = await computeMonth(emp.id, emp.baseSalary, year, month);
        return { employeeId: emp.id, amount, daysWorked, isFinal: false };
      })
    );

    return reply.send({ rows });
  });

  app.get('/year', { preHandler: requireRole(...ALLOWED) }, async (request, reply) => {
    const parsed = yearQuerySchema.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: 'Укажите year' });
    const { year } = parsed.data;

    const records = await prisma.salaryRecord.findMany({ where: { year, isFinal: true } });
    const byEmployee: Record<number, Record<number, number>> = {};
    for (const r of records) {
      byEmployee[r.employeeId] ??= {};
      byEmployee[r.employeeId][r.month] = Number(r.amount);
    }
    return reply.send({ byEmployee });
  });

  app.post('/finalize', { preHandler: requireRole(...ALLOWED) }, async (request, reply) => {
    const parsed = finalizeSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Некорректные данные', details: parsed.error.issues });
    const { employeeId, year, month } = parsed.data;

    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) return reply.code(404).send({ error: 'Сотрудник не найден' });

    let { amount, daysWorked } = await computeMonth(employeeId, employee.baseSalary, year, month);
    if (parsed.data.amount !== undefined) amount = parsed.data.amount;

    const record = await prisma.salaryRecord.upsert({
      where: { employeeId_year_month: { employeeId, year, month } },
      create: { employeeId, year, month, amount, daysWorked, isFinal: true },
      update: { amount, daysWorked, isFinal: true },
    });

    return reply.send({ record });
  });
}
