import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllExceptionsFilter } from './../exceptions-handler/all-exceptions.filter';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],

  exports: [UserService],
})
export class UserModule {}
