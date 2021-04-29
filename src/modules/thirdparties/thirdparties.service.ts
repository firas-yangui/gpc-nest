import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ThirdpartyRepository } from './thirdparties.repository';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Thirdparty } from './thirdparty.entity';
import { Thirdparty as ThirdpartyInterface } from './../interfaces/common-interfaces';
import { getConnection, getRepository } from 'typeorm';
import { AmountStat } from '../amountstats/amountstat.entity';

@Injectable()
export class ThirdpartiesService {
  public thirdpartyChilds: number[];
  constructor(@InjectRepository(ThirdpartyRepository) private readonly thirdpartyRepository: ThirdpartyRepository) {
    this.thirdpartyChilds = [];
  }

  public async getThirdPartyById(id: number) {
    const thirdparty = await this.thirdpartyRepository.findOne({ id });
    if (!thirdparty) {
      throw new NotFoundException(`Thirdparty with id ${id} not found`);
    }

    return thirdparty;
  }

  async findAndCount(): Promise<[Thirdparty[], number]> {
    return await this.thirdpartyRepository.findAndCount();
  }

  async find(options: { gpcAppSettingsId?: string }): Promise<Thirdparty[]> {
    // options.relations = ['thirdpartyappsettings', 'thirdpartyappsettings.gpcappsettings', 'country'];

    try {
      const query = getConnection()
        .createQueryBuilder()
        .select('thirdparty')
        .from(Thirdparty, 'thirdparty')
        .innerJoinAndSelect('thirdparty.thirdpartyappsettings', 'thirdpartyappsettings')
        .innerJoinAndSelect('thirdpartyappsettings.gpcappsettings', 'gpcappsettings')
        .innerJoinAndSelect('thirdparty.country', 'country');

      if (options.gpcAppSettingsId) query.where('gpcappsettings.id = :gpcAppSettingsId', { gpcAppSettingsId: +options.gpcAppSettingsId });
      return await query.getMany();
    } catch (error) {
      Logger.error(error, 'ThirdpartiesService');
      return [];
    }
  }

  async findOne(options: object = {}): Promise<Thirdparty> {
    return await this.thirdpartyRepository.findOne(options);
  }

  async findNosicaWorkloadsWithSubServiceCode() {
    return await this.thirdpartyRepository.find({});
  }

  populateChildren(itemList: ThirdpartyInterface[], parent: ThirdpartyInterface): ThirdpartyInterface {
    this.thirdpartyChilds.push(parent.id);
    parent.children = _.filter<ThirdpartyInterface>(itemList, (item: ThirdpartyInterface) => {
      return item.thirdpartyparent == parent.trigram && item.trigram !== item.thirdpartyparent;
    });

    parent.children.forEach((child: ThirdpartyInterface) => {
      this.populateChildren(itemList, child);
    });

    return parent;
  }

  buildTree(thirdparties: ThirdpartyInterface[], myThirdpartyRoot: ThirdpartyInterface): ThirdpartyInterface {
    const result: ThirdpartyInterface = {
      id: myThirdpartyRoot.id,
      name: myThirdpartyRoot.trigram,
      trigram: myThirdpartyRoot.trigram,
      radical: myThirdpartyRoot.radical,
      children: [],
    };
    this.thirdpartyChilds.push(myThirdpartyRoot.id);
    _.forEach<ThirdpartyInterface[]>(thirdparties, (thirdparty: ThirdpartyInterface) =>
      result.children.push(this.populateChildren(thirdparties, thirdparty)),
    );

    return result;
  }

  getMyThirdPartiesChilds(): Array<number> {
    return this.thirdpartyChilds;
  }

  async getHydratedThirdpartiesSkipTake(take = 10): Promise<any[]> {
    try {
      const ids = await getConnection()
        .createQueryBuilder()
        .select(['thirdparty.id'])
        .from(Thirdparty, 'thirdparty')
        .orderBy('thirdparty.id')
        .take(take)
        .getMany();
      const thirdpartiesIds = ids.map(e => e.id);

      const thirdparties = await getRepository('thirdparty')
        .createQueryBuilder('thirdparty')
        .select(['thirdparty.id', 'thirdparty.trigram'])
        .addSelect(['service.id', 'service.name'])
        .addSelect(['subservice.id', 'subservice.code', 'subservice.name', 'subservice.thirdpPartyId'])
        .addSelect(['workload.id', 'workload.description'])
        .addSelect(['amount.keuros', 'amount.period'])

        .leftJoin('thirdparty.serviceAppSettings', 'serviceappsettings')
        .leftJoin('serviceappsettings.model', 'service')
        .leftJoin('service.subservices', 'subservice')
        .leftJoin('subservice.workloads', 'workload')
        .leftJoin('workload.amounts', 'amount')

        .where('thirdparty.id IN (:...ids)', { ids: thirdpartiesIds })
        .andWhere('subservice.thirdpPartyId = thirdparty.id')
        .orderBy('thirdparty.id')
        .getRawMany();

      return thirdparties;
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async findThirdpartiesWithAmountTotals(options: { gpcAppSettingsId: number; thirdpartyRootId: number; periodId: number }): Promise<Thirdparty[]> {
    try {
      const myThirdpartyRoot = await this.getThirdPartyById(+options.thirdpartyRootId);
      const thirdparties: ThirdpartyInterface[] = await this.find({});
      this.buildTree(thirdparties, myThirdpartyRoot);
      const thirdpartyChildrenIds = this.getMyThirdPartiesChilds();

      const query = getConnection()
        .createQueryBuilder()
        .select('thirdparty.id', 'id')
        .addSelect('thirdparty.trigram', 'trigram')
        .addSelect('thirdparty.name', 'name')
        .addSelect('SUM(amount-stat.mandays)', 'mandays')
        .addSelect('SUM(amount-stat.keuros)', 'keuros')
        .addSelect('SUM(amount-stat.keurossales)', 'keurossales')
        .addSelect('SUM(amount-stat.klocalcurrency)', 'klocalcurrency')
        .from(Thirdparty, 'thirdparty')
        .innerJoin('thirdparty.thirdpartyappsettings', 'thirdpartyappsettings')
        .innerJoin('thirdpartyappsettings.gpcappsettings', 'gpcappsettings')
        .innerJoin('thirdparty.amountStats', 'amount-stat')
        .where('amount-stat.thirdpartyId = thirdparty.id')
        .andWhere('amount-stat.periodId = :periodId', { periodId: +options.periodId });

      if (options.gpcAppSettingsId) query.andWhere('gpcappsettings.id = :gpcAppSettingsId', { gpcAppSettingsId: +options.gpcAppSettingsId });
      if (options.thirdpartyRootId) query.andWhere('thirdparty.id IN (:...ids)', { ids: thirdpartyChildrenIds });

      return await query.groupBy('thirdparty.id').getRawMany();
    } catch (error) {
      Logger.error(error, 'ThirdpartiesService');
      return [];
    }
  }
}
