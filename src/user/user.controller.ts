import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      if (!createUserDto.password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Password is required' });
      }
      const userCreated = await this.userService.createUser(createUserDto);
      return res.status(HttpStatus.CREATED).json(userCreated);
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: {
            status: HttpStatus.BAD_REQUEST,
            message: error.message,
          },
        });
      } else {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: 'Internal server error',
        });
      }
    }
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async listUsers(@Res() res) {
    try {
      const users = await this.userService.listUsers();
      return res.status(HttpStatus.OK).json(users);
    } catch (error: any) {
      if (error.message === 'Nenhum usuário encontrado') {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: {
            status: HttpStatus.NOT_FOUND,
            message: error.message,
          },
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: 'Internal server error',
        });
      }
    }
  }
}
