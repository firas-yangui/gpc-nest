import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MyViewRepository } from './my-view.repository';
import { MyView } from './my-view.entity';
import { DeleteResult, getManager } from 'typeorm';

@Injectable()
export class MyViewService {
  constructor(
    @InjectRepository(MyViewRepository)
    private myViewRepository: MyViewRepository,
  ) {}

  async findAllByUserId(userId: number): Promise<MyView[]> {
    const manager = getManager();
    const query = manager
      .createQueryBuilder()
      .from(MyView, 'mv')
      .select('mv')
      .where('mv.user_id = :userId', { userId: userId });
    const result = await query.getMany();
    return result;
  }

  async save(myView: MyView): Promise<MyView> {
    return await this.myViewRepository.save(myView);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.myViewRepository.delete(id);
  }
}
