import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    Validate,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class CreateUserDto {
    @ApiProperty({
        example: 'John',
        description: 'User first name',
        minLength: 3,
        maxLength: 20,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'User last name',
        minLength: 3,
        maxLength: 20,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    lastName: string;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'User email address',
        maxLength: 255,
    })
    @IsEmail()
    @MaxLength(255)
    email: string;

    @ApiProperty({
        example: 'user',
        description: 'User role',
        enum: ['admin', 'moderator', 'user'],
    })
    @IsEnum(['admin', 'moderator', 'user'], {
        message: 'Role must be one of: admin, moderator, user',
    })
    role: string;

    @ApiProperty({
        example: 'male',
        description: 'User gender',
        enum: ['male', 'female', 'other'],
    })
    @IsEnum(['male', 'female', 'other'], {
        message: 'Gender must be one of: male, female, other',
    })
    gender: string;

    @ApiProperty({
        example: 'Password@123',
        description:
            'User password. Must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        minLength: 8,
        maxLength: 20,
    })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        },
    )
    password: string;

    @ApiProperty({
        example: 'Password@123',
        description: 'Must match the password field',
    })
    @IsString()
    @IsNotEmpty()
    // @Equals('Password@2025', { message: 'Passwords do not match' })
    @Validate(Match, ['password'])
    confirmPassword: string;

    @ApiPropertyOptional({
        example: '+1234567890',
        description: 'User phone number',
    })
    @IsOptional()
    @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
        message: 'Phone number must be valid',
    })
    phone?: string;

    @ApiProperty({
        example: '1990-01-01',
        description: 'User date of birth',
        type: 'string',
        format: 'date',
    })
    @IsNotEmpty()
    @Type(() => Date)
    dateOfBirth: Date;

    @ApiProperty({
        example: 'active',
        description: 'User account status',
        enum: ['active', 'inactive'],
    })
    @IsEnum(['active', 'inactive'], {
        message: 'Status must be one of: active, inactive',
    })
    status: string;

    @ApiProperty({
        example: 'engineering',
        description: 'User department',
        enum: [
            'engineering',
            'marketing',
            'sales',
            'hr',
            'finance',
            'operations',
        ],
    })
    @IsEnum(
        ['engineering', 'marketing', 'sales', 'hr', 'finance', 'operations'],
        {
            message:
                'Department must be one of: engineering, marketing, sales, hr, finance, operations',
        },
    )
    department: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the user email is verified',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isEmailVerified?: boolean = true;

    @ApiProperty({
        example: 4.5,
        description: 'User rating',
    })
    @IsNumber()
    rating: number;

    @ApiPropertyOptional({
        example: '123 Main St, Anytown, USA',
        description: 'User address',
    })
    @IsOptional()
    address?: string;

    @ApiProperty({
        example: 'dark',
        description: 'User preferred theme',
    })
    @IsString()
    preferredTheme: string;

    @ApiProperty({
        example: 5,
        description: 'User experience level in years',
    })
    @IsNumber()
    experienceLevel: number;

    @ApiProperty({
        example: ['JavaScript', 'TypeScript', 'Node.js'],
        description: 'User skills',
        type: [String],
    })
    @IsArray()
    skills: string[];

    @ApiPropertyOptional({
        example: false,
        description: 'Soft delete flag',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    delFlg?: boolean = false;
}
