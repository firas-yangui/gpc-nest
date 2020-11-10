import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AmountRepository } from './amounts.repository';
import { Amount as AmountEntity } from './amount.entity';
import { RawAmount } from './../rawamounts/rawamount.entity';
import { Amount } from './../interfaces/common-interfaces';
import { getConnection } from 'typeorm';

@Injectable()
export class AmountsService {
  constructor(
    @InjectRepository(AmountRepository)
    private amountRepository: AmountRepository,
  ) {}

  async save(entities: Amount, options: any = {}) {
    return this.amountRepository.save(entities, options);
  }

  async findOne(options: Record<string, any>): Promise<Amount | undefined> {
    return this.amountRepository.findOne(options);
  }

  async synchronizeFromRawAmounts(source: string): Promise<void> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.query(
        `DELETE FROM amount a
        USING rawamount ra
        WHERE a.workloadid = ra.workloadid
        AND a.periodid = ra.periodid
        AND ra.datasource LIKE $1`,
        [source],
      );

      await queryRunner.manager.query(
        `INSERT INTO amount (workloadid, periodid, mandays, keuros, klocalcurrency, keurossales)
        SELECT ra.workloadid, ra.periodid, SUM(ra.mandays), SUM(ra.keuros), SUM(ra.klocalcurrency), SUM(ra.keurossales)
        FROM rawamount ra
        WHERE ra.datasource LIKE $1
        GROUP BY ra.workloadid, ra.periodid`,
        [source],
      );

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(RawAmount, 'rawamount')
        .where('datasource LIKE :datasource', { datasource: source })
        .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
