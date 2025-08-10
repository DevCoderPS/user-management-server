import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { RedisModule } from 'src/shared/cache/redis.module';

@Module({
    imports: [
        // register the user schema with MongooseModule
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        // Import RedisModule for caching
        RedisModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
