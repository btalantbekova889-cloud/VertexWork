import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const createSchema = z.object({
  fullName: z.string().min(1),
  position: z.string().min(1),
  baseSalary: z.number().positive(),
  phone: z.string().optional(),
  inn: z.string().optional(),
  hiredAt: z.string().optional(),
  plate: z.string().optional(),
  vehicle: z.string().optional(),
});

const updateSchema = createSchema.partial();

export default async function employeeRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: requireAuth }, async (_request, reply) => {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      include: { plate: true },
      orderBy: { id: 'asc' },
    });
    return reply.send({ employees });
  });

  app.post('/', { preHandler: requireRole('hr', 'director') }, async (request, reply) => {
    const parsed = createSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Некорректные данные', details: parsed.error.issues });
    const { plate, vehicle, hiredAt, ...rest } = parsed.data;

    const employee = await prisma.employee.create({
      data: {
        ...rest,
        hiredAt: hiredAt ? new Date(hiredAt) : undefined,
        plate: plate ? { create: { plate, vehicle } } : undefined,
      },
      include: { plate: true },
    });
    return reply.code(201).send({ employee });
  });

  app.patch('/:id', { preHandler: requireRole('hr', 'director') }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    const parsed = updateSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Некорректные данные', details: parsed.error.issues });
    const { plate, vehicle, hiredAt, ...rest } = parsed.data;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        ...rest,
        hiredAt: hiredAt ? new Date(hiredAt) : undefined,
        plate: plate
          ? { upsert: { create: { plate, vehicle }, update: { plate, vehicle } } }
          : undefined,
      },
      include: { plate: true },
    });
    return reply.send({ employee });
  });

  app.delete('/:id', { preHandler: requireRole('hr', 'director') }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    await prisma.employee.update({ where: { id }, data: { isActive: false } });
    return reply.send({ ok: true });
  });
}
