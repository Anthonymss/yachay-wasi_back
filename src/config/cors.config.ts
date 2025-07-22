import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: ['http://localhost:5173','http://localhost:5174','https://yw-landing.vercel.app','https://yw-front.vercel.app','https://yw-front-intranet-oljh-omega.vercel.app'],
  //origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
