import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './schema/user.schema';

@Controller({ path: 'users', version: '1' })
@ApiTags('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiCreatedResponse({ type: User })
    async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOkResponse({ type: User, isArray: true })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
    ): Promise<{ data: UserResponseDto[] }> {
        return this.usersService.findAll(page, limit);
    }

    @Get(':id')
    @ApiOkResponse({ type: User })
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    @ApiOkResponse({ type: User })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: User })
    async remove(@Param('id') id: string): Promise<{ success: boolean }> {
        const success = await this.usersService.remove(id);
        return { success };
    }
}
