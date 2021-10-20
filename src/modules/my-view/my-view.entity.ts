import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SynthesisFilterDTO } from '../workloads/dto/synthesis-filter.dto';

@Entity('my_views')
export class MyView {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    name: 'user_id',
  })
  userId: number;

  @ApiProperty()
  @Column({ type: 'jsonb' })
  filter: SynthesisFilterDTO;

  @ApiProperty()
  @Column({
    name: 'view_name',
  })
  viewName: string;

  @ApiProperty()
  @Column({
    name: 'filter_name',
  })
  filterName: string;

  @ApiProperty()
  @Column({ name: 'created_date', type: 'date' })
  createdDate: string;
}
