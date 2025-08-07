import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/shared/logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger: LoggerService;
    constructor() {
        this.logger = new LoggerService(HttpExceptionFilter.name);
    }
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        const errorResponse = {
            statusCode: status,
            success: false,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        this.logger.error(
            `[${request.method}] ${request.url} >> StatusCode:: ${status} >> Message:: ${JSON.stringify(
                message,
            )}`,
        );

        response.status(status).json(errorResponse);
    }
}
