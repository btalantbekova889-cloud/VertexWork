import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireRole } from '../middleware/auth';
import { todayDateOnly, nowTimeHHMM } from '../lib/date';

const eventSchema = z.object({
  cameraId: z.number().int(),
  location: z.string().optional(),
  plate: z.string().min(1),
  direction: z.enum(['entry', 'exit']),
  orderNo: z.string().optional(),
  photoUrl: z.string().optional(),
});

async function requireCameraKey(request: FastifyRequest, reply: FastifyReply) {
  const key = request.headers['x-camera-key'];
  if (!key || key !== process.env.CAMERA_SECRET_KEY) {
    reply.code(401).send({ error: 'Неверный ключ камеры' });
  }
}

export default async function cameraRoutes(app: FastifyInstance) {
  // Ingestion endpoint called by the LPR/АРН camera software, not by a logged-in user
  app.post('/event', { preHandler: requireCameraKey }, async (request, reply) => {
    const parsed = eventSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Некорректные данные', details: parsed.error.issues });
    const { cameraId, location, plate, direction, orderNo, photoUrl } = parsed.data;

    const plateRecord = await prisma.plate.findUnique({
      where: { plate },
      include: { employee: true },
    });
    const isAuth = !!plateRecord && plateRecord.isActive && plateRecord.employee.isActive;

    const event = await prisma.cameraEvent.create({
      data: { cameraId, location, plate, direction, isAuth, orderNo, photoUrl },
    });

    if (isAuth && plateRecord) {
      const workDate = todayDateOnly();
      const time = nowTimeHHMM();
      const existing = await prisma.attendance.findUnique({
        where: { employeeId_workDate: { employeeId: plateRecord.employeeId, workDate } },
      });
      if (direction === 'entry') {
        await prisma.attendance.upsert({
          where: { employeeId_workDate: { employeeId: plateRecord.employeeId, workDate } },
          create: { employeeId: plateRecord.employeeId, workDate, entryTime: time, source: 'camera' },
          update: existing?.entryTime ? {} : { entryTime: time },
        });
      } else {
        await prisma.attendance.upsert({
          where: { employeeId_workDate: { employeeId: plateRecord.employeeId, workDate } },
          create: { employeeId: plateRecord.employeeId, workDate, exitTime: time, source: 'camera' },
          update: { exitTime: time },
        });
      }
    }

    return reply.code(201).send({ event, isAuth });
  });

  app.get(
    '/log',
    { preHandler: requireRole('director', 'quarry_manager', 'commercial_director') },
    async (request, reply) => {
      const { limit } = request.query as { limit?: string };
      const events = await prisma.cameraEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit ? Number(limit) : 50,
      });
      return reply.send({ events });
    }
  );

  app.get(
    '/stats',
    { preHandler: requireRole('director', 'commercial_director') },
    async (_request, reply) => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const [entries, exits, authorized, denied] = await Promise.all([
        prisma.cameraEvent.count({ where: { direction: 'entry', createdAt: { gte: start } } }),
        prisma.cameraEvent.count({ where: { direction: 'exit', createdAt: { gte: start } } }),
        prisma.cameraEvent.count({ where: { isAuth: true, createdAt: { gte: start } } }),
        prisma.cameraEvent.count({ where: { isAuth: false, createdAt: { gte: start } } }),
      ]);

      return reply.send({ entries, exits, authorized, denied });
    }
  );
}
