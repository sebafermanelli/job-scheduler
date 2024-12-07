import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsConfig } from './configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Job Scheduler API')
    .setDescription('API to handle jobs')
    .setVersion('1.0.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Cors
  app.enableCors(new CorsConfig().getCorsOptions());

  // Global prefix
  app.setGlobalPrefix('api');

  // Listen
  await app.listen(port);
  Logger.log(`Server running on port ${port} 🚀`, 'Bootstrap');
  Logger.log(
    `Environment: ${configService.get('NODE_ENV') || 'default'} 🌐`,
    'Bootstrap',
  );
}
bootstrap();
