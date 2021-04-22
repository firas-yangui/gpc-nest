import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { ThirdpartiesModule } from '../thirdparties/thirdparties.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionRepository]), UserModule, ThirdpartiesModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [],
})
export class TransactionModule {}
