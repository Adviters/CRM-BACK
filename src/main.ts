import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  const corsOrigins = configService.get<string[]>('cors.origins') ?? [];
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : false,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  if (configService.get<boolean>('swagger.enabled')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Pet Shop CRM API')
      .setDescription('CRM backend for veterinary clinics and pet shops')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(
      configService.getOrThrow<string>('swagger.path'),
      app,
      document,
    );
  }

  const port = configService.getOrThrow<number>('port');
  await app.listen(port);

  logger.log(`Application running on http://localhost:${port}/api`);
  if (configService.get<boolean>('swagger.enabled')) {
    const swaggerPath = configService.getOrThrow<string>('swagger.path');
    logger.log(`Swagger docs at http://localhost:${port}/${swaggerPath}`);
  }
}

void bootstrap();
