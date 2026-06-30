import '@fastify/jwt';

export interface JwtUser {
  id: number;
  login: string;
  name: string;
  role: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtUser;
    user: JwtUser;
  }
}
