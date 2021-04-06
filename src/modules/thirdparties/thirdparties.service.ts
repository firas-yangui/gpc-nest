import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ThirdpartyRepository } from './thirdparties.repository';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Thirdparty } from './thirdparty.entity';
import { Thirdparty as ThirdpartyInterface } from './../interfaces/common-interfaces';
import { getConnection } from 'typeorm';

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

  async find(options): Promise<Thirdparty[]> {
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
}
