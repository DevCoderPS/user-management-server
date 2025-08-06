export default () => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 8888,
    database: {
        uri:
            process.env.MONGODB_URI ||
            'mongodb://localhost:27017/user-management',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    logging: {
        level: process.env.LOG_LEVEL || 'debug',
        file: process.env.LOG_FILE || 'logs/combined.log',
        errorFile: process.env.LOG_ERROR_FILE || 'logs/error.log',
    },
});
