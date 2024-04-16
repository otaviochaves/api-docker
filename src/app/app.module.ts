import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModule } from 'src/infra/database/repository/repository.module';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [RepositoryModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
