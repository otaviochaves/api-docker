import { Injectable } from '@nestjs/common';
import { MysqlClient } from './mysql.database';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(private readonly connection: MysqlClient) {}

  async createUser(user: User): Promise<any> {
    try {
      const salt = await bcrypt.genSalt(6);
      const hashUser = await bcrypt.hash(user.password, salt);
      const sql = `INSERT INTO tb_user(id,
                name, email, password)
                VALUES ('${user.id}','${user.name}', '${user.email}', '${hashUser}')`;

      const request = await this.connection.executeSql(sql);

      return { message: 'Usuario criado com sucesso', request };
    } catch (error) {
      return { error: error.message };
    }
  }

  async listUsers(): Promise<any> {
    try {
      const sql = `SELECT * FROM tb_user`;
      const result = await this.connection.executeSql(sql);
      if (result.results && result.results.length > 0) {
        const users = result.results.map((user: any) => {
          delete user.noSenha;
          return user;
        });
        return users;
      } else {
        throw new Error('No users found');
      }
    } catch (errorSql: any) {
      throw new Error(errorSql.message);
    }
  }
}
