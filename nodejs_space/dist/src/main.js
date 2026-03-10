"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const express = require('express');
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    const publicPath = (0, path_1.join)(__dirname, '..', '..', 'public');
    app.useStaticAssets(publicPath);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    const swaggerPath = 'api-docs';
    app.use(`/${swaggerPath}`, (req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        next();
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Arena Excel API')
        .setDescription('API completa para o aplicativo Arena Excel - Aprenda Excel de forma gamificada')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(swaggerPath, app, document, {
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
//# sourceMappingURL=main.js.map