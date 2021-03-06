import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ThirdpartyRepository } from './thirdparties.repository';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Thirdparty } from './thirdparty.entity';
import { Thirdparty as ThirdpartyInterface } from './../interfaces/common-interfaces';
import { getConnection, getManager, getRepository } from 'typeorm';
import { isNull, isUndefined } from 'lodash';

@Injectable()
export class ThirdpartiesService {
  public thirdpartyChilds: Set<number>;
  constructor(@InjectRepository(ThirdpartyRepository) private readonly thirdpartyRepository: ThirdpartyRepository) {
    // eslint-disable-next-line no-undef
    this.thirdpartyChilds = new Set();
  }

  public async getThirdPartyById(id: number) {
    const thirdparty = await this.thirdpartyRepository.findOne({ id });
    if (!thirdparty) {
      throw new NotFoundException(`Thirdparty with id ${id} not found`);
    }

    return thirdparty;
  }

  async getThirdParty(): Promise<any[]> {
    return await this.thirdpartyRepository.find();
  }

  async findAndCount(): Promise<[Thirdparty[], number]> {
    return await this.thirdpartyRepository.findAndCount();
  }

  async find(options: { gpcAppSettingsId?: string }): Promise<Thirdparty[]> {
    // options.relations = ['thirdpartyappsettings', 'thirdpartyappsettings.gpcappsettings', 'country'];

    try {
      const query = getManager()
        .createQueryBuilder()
        .select('thirdparty')
        .from(Thirdparty, 'thirdparty')
        .innerJoinAndSelect('thirdparty.thirdpartyappsettings', 'thirdpartyappsettings')
        .innerJoinAndSelect('thirdpartyappsettings.gpcappsettings', 'gpcappsettings')
        .innerJoinAndSelect('thirdparty.country', 'country'); //? why need

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
    this.thirdpartyChilds.add(parent.id);
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
    this.thirdpartyChilds.add(myThirdpartyRoot.id);
    _.forEach<ThirdpartyInterface[]>(thirdparties, (thirdparty: ThirdpartyInterface) =>
      result.children.push(this.populateChildren(thirdparties, thirdparty)),
    );

    return result;
  }

  getMyThirdPartiesChilds(): Array<number> {
    return Array.from(this.thirdpartyChilds);
  }

  async getHydratedThirdpartiesSkipTake(take = 10): Promise<any[]> {
    try {
      const ids = await getManager()
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

  async findThirdpartiesWithAmountTotals(options: { gpcAppSettingsId?: number; thirdpartyRootId?: number; periodId?: number }): Promise<any> {
    try {
      const myThirdpartyRoot = await this.getThirdPartyById(+options.thirdpartyRootId);
      const thirdparties: ThirdpartyInterface[] = await this.find({});
      this.buildTree(thirdparties, myThirdpartyRoot);
      const thirdpartyChildrenIds = this.getMyThirdPartiesChilds();

      const query = getManager()
        .createQueryBuilder()
        .select('thirdparty.id', 'id')
        .addSelect('thirdparty.name', 'name')
        .addSelect('thirdparty.trigram', 'trigram')
        .addSelect('amountstat1."periodId"', 'periodId')
        .addSelect('SUM(amountstat1.mandays)', 'mandays')
        .addSelect('SUM(amountstat1.keuros)', 'keuros')
        .addSelect('SUM(amountstat1.keurossales)', 'keurossales')
        .addSelect('SUM(amountstat1.klocalcurrency)', 'klocalcurrency')

        .from(Thirdparty, 'thirdparty')
        .innerJoin('thirdparty.thirdpartyappsettings', 'thirdpartyappsettings')
        .innerJoin('thirdpartyappsettings.gpcappsettings', 'gpcappsettings')
        .leftJoin('thirdparty.amountStats', 'amountstat1', 'amountstat1."thirdpartyId" = thirdparty.id');

      if (!isNull(options.periodId) && !isUndefined(options.periodId))
        query.andWhere('amountstat1."periodId" = :periodId', { periodId: +options.periodId });

      if (options.gpcAppSettingsId) query.andWhere('gpcappsettings.id = :gpcAppSettingsId', { gpcAppSettingsId: +options.gpcAppSettingsId });
      if (options.thirdpartyRootId) query.andWhere('thirdparty.id IN (:...ids)', { ids: thirdpartyChildrenIds });

      const rows = await query
        .groupBy('thirdparty.id')
        .addGroupBy('thirdparty.name')
        .addGroupBy('thirdparty.trigram')
        .addGroupBy('amountstat1."periodId"')
        .getRawMany();

      const grouped = _.groupBy(rows, 'id');
      const result = _.mapValues(grouped, function(group) {
        return _.groupBy(group, 'periodId');
      });

      return result;
    } catch (error) {
      Logger.error(error, 'ThirdpartiesService');
      return [];
    }
  }
}
