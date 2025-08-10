import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import { createLoggerConfig } from './config/logger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(
            createLoggerConfig('NestApplication'),
        ),
    });

    // set global prefix for all routes
    app.setGlobalPrefix('api');

    // Enable API versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    app.enableCors({
        origin: ['http://localhost:5173', 'https://your-production-domain.com'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    });

    // Enable validation for all incoming requests using class-validator
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strips away properties that are not defined in the DTO
            forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
            transform: true, // Automatically transforms payload objects to DTO instances
        }),
    );

    // Global Error Handling
    app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger Setup
    const config = new DocumentBuilder()
        .setTitle('User Management API')
        .setDescription('API documentation for the User Management System')
        .setVersion('1.0')
        .addBearerAuth() // For JWT authentication
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const configService = app.get(ConfigService);

    await app.listen(configService.get('port'));
}
bootstrap();
