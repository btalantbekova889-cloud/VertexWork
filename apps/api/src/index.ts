import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';

import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import cameraRoutes from './routes/cameras';
import attendanceRoutes from './routes/attendance';
import salaryRoutes from './routes/salaries';

const app = Fastify({ logger: true });

const ORIGIN = process.env.WEB_ORIGIN || 'http://localhost:3000';

async function main() {
  await app.register(cors, {
    origin: ORIGIN,
    credentials: true,
  });

  await app.register(cookie);

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev_secret',
    cookie: { cookieName: 'vertex_token', signed: false },
  });

  app.get('/api/health', async () => ({ ok: true, time: new Date().toISOString() }));

  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(employeeRoutes, { prefix: '/api/employees' });
  app.register(cameraRoutes, { prefix: '/api/cameras' });
  app.register(attendanceRoutes, { prefix: '/api/attendance' });
  app.register(salaryRoutes, { prefix: '/api/salaries' });

  const port = Number(process.env.PORT) || 4000;
  await app.listen({ port, host: '0.0.0.0' });
}

main().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
