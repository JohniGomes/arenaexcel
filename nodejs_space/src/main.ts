import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Increase body size limit for image uploads (50MB)
  const express = require('express');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // Serve exercise images from public folder
  const publicPath = join(__dirname, '..', '..', 'public');
  app.useStaticAssets(publicPath);

  // CORS configuration
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Allow extra properties (e.g., Google OAuth params)
      transform: true,
    }),
  );

  // Swagger documentation setup
  const swaggerPath = 'api-docs';
  
  // Middleware to prevent CDN/browser caching of Swagger docs
  app.use(`/${swaggerPath}`, (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Arena Excel API')
    .setDescription('API completa para o aplicativo Arena Excel - Aprenda Excel de forma gamificada')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'Arena Excel API',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #2c3e50; font-size: 2.5em; font-weight: 700; }
      .swagger-ui .info .description { color: #34495e; font-size: 1.1em; line-height: 1.6; }
      .swagger-ui .scheme-container { background: #f8f9fa; border: none; padding: 20px; border-radius: 8px; }
      .swagger-ui .opblock { border-radius: 8px; margin-bottom: 15px; border: 1px solid #e1e4e8; }
      .swagger-ui .opblock-tag { font-size: 1.3em; font-weight: 600; color: #2c3e50; }
      .swagger-ui .opblock.opblock-post { border-color: #49cc90; }
      .swagger-ui .opblock.opblock-get { border-color: #61affe; }
      .swagger-ui .opblock.opblock-put { border-color: #fca130; }
      .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; }
      .swagger-ui .btn.execute { background-color: #4990e2; border-color: #4990e2; }
      .swagger-ui .btn.execute:hover { background-color: #357abd; }
      body { background-color: #ffffff; }
    `,
    customfavIcon: 'https://cdn-icons-png.flaticon.com/512/888/888850.png',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`\n========================================`);
  logger.log(`⚡ Arena Excel API is running on port ${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/${swaggerPath}`);
  logger.log(`========================================\n`);
}

bootstrap();