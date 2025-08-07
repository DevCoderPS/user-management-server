import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { logger } from 'src/utils/logger.util';

@Injectable()
export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);
    constructor(@InjectConnection() private readonly connection: Connection) {}

    async onModuleInit() {
        try {
            await this.connection;
            logger.log('Database connection established successfully');
            this.logger.log('Database connection established successfully');
        } catch (error) {
            // this.logger.error(`Database connection failed: ${error.message}`);
            throw error;
        }
    }

    getDbHandle(): Connection {
        return this.connection;
    }
}
