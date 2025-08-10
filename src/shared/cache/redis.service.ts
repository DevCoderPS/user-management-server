import { Injectable, OnModuleInit } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit {
    private readonly logger: LoggerService;
    private client: Redis;
    constructor(private readonly configService: ConfigService) {
        this.logger = new LoggerService(RedisService.name);
    }

    /**
     * Initializes the Redis client connection.
     */
    onModuleInit() {
        const host =
            this.configService.get<string>('redis.host') || 'localhost';
        const port = this.configService.get<number>('redis.port') || 6379;
        // const password = this.configService.get<string>('redis.password');

        parseInt(process.env.REDIS_PORT);

        this.client = new Redis({
            host,
            port,
            // password,
        });

        this.client.on('connect', () => {
            this.logger.log('✅ Redis connected successfully');
        });

        this.client.on('error', (error) => {
            this.logger.error(`❌ Redis connection failed:`, error.stack);
        });
    }

    async get(key: string): Promise<any> {
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            this.logger.error(`Error getting key ${key} from Redis`, error);
            return null;
        }
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            const stringValue = JSON.stringify(value);
            if (ttl) {
                await this.client.setex(key, ttl, stringValue);
            } else {
                await this.client.set(key, stringValue);
            }
        } catch (error) {
            this.logger.error(`Error setting key ${key} in Redis`, error);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            this.logger.error(`Error deleting key ${key} from Redis`, error);
        }
    }

    async delPattern(pattern: string | string[]): Promise<void> {
        try {
            const patterns = Array.isArray(pattern) ? pattern : [pattern];
            const keysToDelete: string[] = [];

            for (const p of patterns) {
                const keys = await this.client.keys(p);
                keysToDelete.push(...keys);
            }

            if (keysToDelete.length > 0) {
                await this.client.del(...keysToDelete);
            }
        } catch (error) {
            this.logger.error(
                `Error deleting keys with pattern ${pattern} from Redis`,
                error,
            );
        }
    }

    async getHash(key: string): Promise<Record<string, string>> {
        return this.client.hgetall(key);
    }

    async setHash(key: string, data: Record<string, string>): Promise<void> {
        await this.client.hmset(key, data);
    }
}
