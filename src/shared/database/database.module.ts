import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { logger } from 'src/utils/logger.util';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('database.uri'),
                connectionFactory: (connection) => {
                    logger.log('✅ MongoDB connected successfully');
                    return connection;
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [DatabaseService],
    exports: [MongooseModule],
})
export class DatabaseModule {}
