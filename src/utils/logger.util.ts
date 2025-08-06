import * as winston from 'winston';
// import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

class WinstonLogger implements LoggerService {
    private logger: winston.Logger;

    constructor() {
        this.initializeLogger();
    }

    private initializeLogger() {
        const isProduction = process.env.NODE_ENV === 'production';

        this.logger = winston.createLogger({
            level: isProduction ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                // winston.format.errors({ stack: true }),
                // isProduction
                //     ? winston.format.json()
                //     : nestWinstonModuleUtilities.format.nestLike(),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                }),
            ],
        });
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, { trace, context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context });
    }
}

// Singleton instance
export const logger = new WinstonLogger();
