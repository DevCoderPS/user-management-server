import {
    IsBoolean,
    IsDateString,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

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
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        },
    )
    password: string;

    @IsOptional()
    @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
        message: 'Phone number must be valid',
    })
    phone?: string;

    @IsDateString()
    dateOfBirth: Date;

    @IsEnum(['active', 'inactive'], {
        message: 'Status must be one of: active, inactive',
    })
    status: string;

    @IsOptional()
    @IsBoolean()
    emailVerified?: boolean = true;

    @IsOptional()
    address?: string;

    @IsOptional()
    @IsBoolean()
    delFlg?: boolean = false;
}
