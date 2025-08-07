import { Exclude } from 'class-transformer';

export class UserResponseDto {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    gender: string;

    @Exclude()
    password: string;

    phone?: string;
    dateOfBirth: Date;
    status: string;
    emailVerified: boolean;
    address?: string;
    delFlg: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}
