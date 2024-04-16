import { Injectable } from '@nestjs/common';
import { MysqlClient } from 'src/infra/database/repository/mysql/mysql.database';
import { UserRepository } from 'src/infra/database/repository/mysql/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly mysql: MysqlClient,
    private readonly userRepository: UserRepository,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
      if (!createUserDto.password) {
        throw new Error('Password is required');
      }

      if (createUserDto.email) {
        const sql = 'SELECT * FROM tb_user WHERE email = ?;';
        const result = await this.mysql.executeSql(sql, [createUserDto.email]);

        if (result.results && result.results.length > 0) {
          throw new Error('Email already exists');
        } else {
          const user = await this.userRepository.createUser(createUserDto);
          if (user.error) {
            throw new Error(user.error);
          }
          return user;
        }
      }
    } catch (error: any) {
      if (error === 'Email already exists') {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async listUsers() {
    try {
      const users = await this.userRepository.listUsers();
      if (users && users.length > 0) {
        return { users, total: users.length };
      } else {
        throw new Error('No users found');
      }
    } catch (errorSql: any) {
      if (errorSql.message == 'No users found') {
        throw new Error(errorSql.message);
      } else {
        throw new Error('Error internal server');
      }
    }
  }
}
