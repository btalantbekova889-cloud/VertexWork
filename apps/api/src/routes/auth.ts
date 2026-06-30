import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const COOKIE_NAME = 'vertex_token';

const loginSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export default async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Введите логин и пароль' });
    }
    const { login, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { login } });
    if (!user || !user.isActive) {
      return reply.code(401).send({ error: 'Неверный логин или пароль' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return reply.code(401).send({ error: 'Неверный логин или пароль' });
    }

    const payload = { id: user.id, login: user.login, name: user.name, role: user.role };
    const token = await reply.jwtSign(payload, { expiresIn: '12h' });

    reply.setCookie(COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 12,
    });

    return reply.send({ user: payload });
  });

  app.post('/logout', async (_request, reply) => {
    reply.clearCookie(COOKIE_NAME, { path: '/' });
    return reply.send({ ok: true });
  });

  app.get('/me', { preHandler: requireAuth }, async (request, reply) => {
    return reply.send({ user: request.user });
  });
}
