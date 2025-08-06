import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({
        required: true,
        minlength: 3,
        maxlength: 20,
    })
    firstName: string;

    @Prop({
        required: true,
        minlength: 3,
        maxlength: 20,
    })
    lastName: string;

    @Prop({
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxlength: 255,
    })
    email: string;

    @Prop({
        required: true,
        enum: ['admin', 'Moderator', 'User'],
    })
    role: string;

    @Prop({
        required: true,
        enum: ['male', 'female', 'other'],
    })
    gender: string;

    @Prop({
        required: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        select: false, // Typically don't return password in queries
    })
    password: string;

    @Prop({
        match: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
    })
    phone?: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({
        required: true,
        enum: ['active', 'inactive'],
    })
    status: string;

    @Prop({ default: true })
    emailVerified: boolean;

    @Prop()
    address?: string;

    @Prop({ default: false })
    delFlg: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
