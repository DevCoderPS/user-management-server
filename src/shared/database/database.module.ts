import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../logger/logger.service';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const uri = configService.get<string>('database.uri');
                // const logger = new MyLogger();
                const logger = new LoggerService('DatabaseModule');
                logger.log('Attempting to connect to MongoDB...');
                logger.log(`MongoDB URI: ${uri}`);

                return {
                    uri,
                    connectionFactory: (connection) => {
                        if (connection.readyState === 1) {
                            logger.log('MongoDB connected successfully!');
                        }
                        connection.on('connected', () => {
                            logger.log('MongoDB is connected');
                        });
                        connection.on('disconnected', () => {
                            logger.error('MongoDB disconnected');
                        });
                        connection.on('error', (error) => {
                            logger.error('MongoDB connection error: ', error);
                        });
                        return connection;
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {}
