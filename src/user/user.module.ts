import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RepositoryModule } from 'src/infra/database/repository/repository.module';
import { UserRepository } from 'src/infra/database/repository/mysql/user.repository';
import { MysqlClient } from 'src/infra/database/repository/mysql/mysql.database';

@Module({
  imports: [RepositoryModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, MysqlClient],
})
export class UserModule {}
