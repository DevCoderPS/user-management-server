import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // set global prefix for all routes
    app.setGlobalPrefix('api');

    // Enable API versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    const configService = app.get(ConfigService);

    await app.listen(configService.get('port'));
}
bootstrap();
