import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLoggerConfig } from 'src/config/logger.config';
import { createLogger, Logger } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
    private logger: Logger;

    constructor(private serviceName: string) {
        this.logger = createLogger(createLoggerConfig(serviceName));
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
