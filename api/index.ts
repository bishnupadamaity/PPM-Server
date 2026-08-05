import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';

const server = express();
let bootstrapped = false;

async function bootstrap() {
  if (!bootstrapped) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors();
    await app.init();
    bootstrapped = true;
  }
  return server;
}

export default async function handler(req: Request, res: Response) {
  const app = await bootstrap();
  app(req, res);
}
