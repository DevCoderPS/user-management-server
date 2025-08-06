import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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

    const configService = app.get(ConfigService);

    await app.listen(configService.get('port'));
}
bootstrap();
