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
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    firstName: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    lastName: string;

    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsEnum(['admin', 'moderator', 'user'], {
        message: 'Role must be one of: admin, moderator, user',
    })
    role: string;

    @IsEnum(['male', 'female', 'other'], {
        message: 'Gender must be one of: male, female, other',
    })
    gender: string;

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

    @IsString()
    @IsNotEmpty()
    // @Equals('Password@2025', { message: 'Passwords do not match' })
    @Validate(Match, ['password'])
    confirmPassword: string;

    @IsOptional()
    @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
        message: 'Phone number must be valid',
    })
    phone?: string;

    @IsNotEmpty()
    @Type(() => Date)
    dateOfBirth: Date;

    @IsEnum(['active', 'inactive'], {
        message: 'Status must be one of: active, inactive',
    })
    status: string;

    @IsEnum(
        ['engineering', 'marketing', 'sales', 'hr', 'finance', 'operations'],
        {
            message:
                'Department must be one of: engineering, marketing, sales, hr, finance, operations',
        },
    )
    department: string;

    @IsOptional()
    @IsBoolean()
    isEmailVerified?: boolean = true;

    @IsNumber()
    rating: number;

    @IsOptional()
    address?: string;

    @IsOptional()
    bio?: string;

    @IsString()
    preferredTheme: string;

    @IsNumber()
    experienceLevel: number;

    @IsArray()
    skills: string[];

    @IsOptional()
    @IsBoolean()
    delFlg?: boolean = false;
}
