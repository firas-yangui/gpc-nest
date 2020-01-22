import { Module } from '@nestjs/common';
import { ThirdpartiesController } from './thirdparties.controller';
import { ThirdpartiesService } from './thirdparties.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdpartyRepository } from './thirdparties.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ThirdpartyRepository])],
  controllers: [ThirdpartiesController],
  providers: [ThirdpartiesService],
  exports: [ThirdpartiesService],
})
export class ThirdpartiesModule {}
