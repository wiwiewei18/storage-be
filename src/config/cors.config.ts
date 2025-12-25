export const corsConfig = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
};
