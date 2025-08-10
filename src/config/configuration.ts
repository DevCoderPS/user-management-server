export default () => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 8888,
    database: {
        uri:
            process.env.MONGODB_URI ||
            'mongodb://localhost:27017/user-management',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
        password: 'redis-password',
    },
    logging: {
        level: process.env.LOG_LEVEL || 'debug',
        file: process.env.LOG_FILE || 'logs/combined.log',
        errorFile: process.env.LOG_ERROR_FILE || 'logs/error.log',
    },
});
