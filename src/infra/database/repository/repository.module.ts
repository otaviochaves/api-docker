import { UserRepository } from './mysql/user.repository';
import { Module } from '@nestjs/common';
import { MysqlClient } from './mysql/mysql.database';

@Module({
  providers: [UserRepository, MysqlClient],
  exports: [UserRepository, MysqlClient],
})
export class RepositoryModule {}
