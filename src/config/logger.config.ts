import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const commonFormats = [
    winston.format.timestamp({
        format: 'MM/DD/YYYY, h:mm:ss A',
    }),
];

const commonTransports = [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({
        filename: 'logs/errors.log',
        level: 'error',
    }),
];

// Development configuration
const devFormat = (serviceName: string) =>
    winston.format.combine(
        ...commonFormats,
        nestWinstonModuleUtilities.format.nestLike(serviceName, {
            colors: true,
            prettyPrint: true,
        }),
    );

const devTransports = [new winston.transports.Console(), ...commonTransports];

// Production configuration
const prodFormat = (serviceName: string) =>
    winston.format.combine(
        ...commonFormats,
        winston.format.printf((info) => {
            return `[Nest] ${process.pid} - ${info.timestamp} ${info.level.toUpperCase()} [${serviceName || 'Application'}] ${info.message}`;
        }),
    );

const prodTransports = [
    new winston.transports.Console({
        format: winston.format.simple(),
    }),
    ...commonTransports,
];

export const createLoggerConfig = (serviceName: string) => ({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format:
        process.env.NODE_ENV === 'production'
            ? prodFormat(serviceName)
            : devFormat(serviceName),
    transports:
        process.env.NODE_ENV === 'production' ? prodTransports : devTransports,
});
