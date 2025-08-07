import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ResponseMessages } from 'src/utils/message';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class UsersService {
    private readonly logger: LoggerService;
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        this.logger = new LoggerService(UsersService.name);
    }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        // check if email already exists
        const existingUserEmail = await this.userModel
            .findOne({
                email: createUserDto.email,
                delFlg: false,
            })
            .exec();
        if (existingUserEmail)
            throw new ConflictException(
                ResponseMessages.EMAIL_ALREADY_REGISTERED,
            );

        // hash password before saving
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

        // create new user
        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });

        const createdUser = await newUser.save();

        this.logger.log(`User created with ID: ${createdUser._id}`);

        return plainToClass(UserResponseDto, createdUser.toJSON());
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
    ): Promise<{ data: UserResponseDto[] }> {
        // fetch user data from database
        this.logger.log(`Fetching users page ${page}, limit ${limit}`);
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.userModel
                .find({ delFlg: false })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.userModel.countDocuments({ delFlg: false }).exec(),
        ]);

        const totalPages = Math.ceil(total / limit);
        const result = {
            data: users.map((user) =>
                plainToClass(UserResponseDto, user.toJSON()),
            ),
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        };

        return result;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        // update user
        const updatedUser = await this.userModel
            .findOneAndUpdate({ _id: id, delFlg: false }, updateUserDto, {
                new: true,
            })
            .exec();
        this.logger.log(`User update with ID: ${updatedUser._id}`);
        return plainToClass(UserResponseDto, updatedUser?.toJSON());
    }

    async remove(id: string): Promise<boolean> {
        // delete user
        const deletedUser = await this.userModel
            .findOneAndUpdate(
                { _id: id, delFlg: false },
                { delFlg: true },
                { new: true },
            )
            .exec();

        this.logger.log(`Soft deleting user with ID: ${deletedUser._id}`);
        return false;
    }
}
