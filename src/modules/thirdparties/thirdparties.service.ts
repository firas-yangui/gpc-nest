import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ThirdpartyRepository } from './thirdparties.repository';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Thirdparty } from './thirdparty.entity';
import { Thirdparty as ThirdpartyInterface } from './../interfaces/common-interfaces';
import { getConnection, getRepository } from 'typeorm';
//import { ServiceAppSettings } from '../serviceappsettings/serviceappsettings.entity';

@Injectable()
export class ThirdpartiesService {
  public thirdpartyChilds: number[];
  constructor(@InjectRepository(ThirdpartyRepository) private readonly thirdpartyRepository: ThirdpartyRepository) {
    this.thirdpartyChilds = [];
  }

  public async getThirdPartyById(id: number) {
    const thirdparty = await this.thirdpartyRepository.findOne({ id });
    if (!thirdparty) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return thirdparty;
  }

  async findAndCount(): Promise<[Thirdparty[], number]> {
    return await this.thirdpartyRepository.findAndCount();
  }

  async find(options: object = {}): Promise<Thirdparty[]> {
    return await this.thirdpartyRepository.find(options);
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
        .select(['thirdparty.id', 'thirdparty.name'])
        .from(Thirdparty, 'thirdparty')
        .orderBy('thirdparty.id')
        .take(take)
        .getMany();
      const thirdpartiesIds = ids.map(e => e.id);

      const thirdparties = await getRepository('thirdparty')
        .createQueryBuilder('thirdparty')
        .select(['thirdparty.id', 'thirdparty.trigram'])
        .where('thirdparty.id IN (:...ids)', { ids: thirdpartiesIds })
        .leftJoin('thirdparty.serviceAppSettings', 'serviceappsettings')
        .leftJoin('serviceappsettings.model', 'service')
        .addSelect(['service.id', 'service.name'])
        .leftJoin('service.subservices', 'subservice')
        .andWhere('subservice.thirdPartyId = thirdparty.id')
        .addSelect(['subservice.id', 'subservice.code', 'subservice.name', 'subservice.thirdPartyId'])
        .leftJoin('subservice.workloads', 'workload')
        .addSelect(['workload.id', 'workload.description'])
        .leftJoin('workload.amounts', 'amount')
        .addSelect(['amount.keuros', 'amount.period'])
        .orderBy('thirdparty.id')
        .getRawMany();

      return thirdparties;
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }
}
