import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import { dateOnly } from '../lib/date';

const querySchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1).max(12),
});

const toggleSchema = z.object({
  employeeId: z.number().int(),
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
});

export default async function attendanceRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: requireAuth }, async (request, reply) => {
    const parsed = querySchema.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: 'Укажите year и month' });
    const { year, month } = parsed.data;

    const from = dateOnly(year, month, 1);
    const to = dateOnly(year, month + 1, 1);

    const records = await prisma.attendance.findMany({
      where: { workDate: { gte: from, lt: to } },
      orderBy: { workDate: 'asc' },
    });
    return reply.send({ records });
  });

  app.post('/toggle', { preHandler: requireRole('hr', 'quarry_manager', 'accountant', 'director') }, async (request, reply) => {
    const parsed = toggleSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Некорректные данные', details: parsed.error.issues });
    const { employeeId, year, month, day } = parsed.data;
    const workDate = dateOnly(year, month, day);

    const existing = await prisma.attendance.findUnique({
      where: { employeeId_workDate: { employeeId, workDate } },
    });

    if (existing) {
      await prisma.attendance.delete({ where: { id: existing.id } });
      return reply.send({ present: false });
    }

    await prisma.attendance.create({
      data: { employeeId, workDate, source: 'manual' },
    });
    return reply.send({ present: true });
  });
}
