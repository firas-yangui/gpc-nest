import { Injectable, NotFoundException } from '@nestjs/common';
import { ThirdpartyRepository } from './thirdparties.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Thirdparty as ThirdpartyInterface } from './../interfaces/common-interfaces';
import * as _ from 'lodash';

@Injectable()
export class ThirdpartiesService {
  constructor(
    @InjectRepository(ThirdpartyRepository)
    private thirdpartyRepository: ThirdpartyRepository,
    private thirdpartyChilds: Array<number>,
  ) {}

  async getThirdPartyById(id: number): Promise<ThirdpartyInterface> {
    const thirdparty = await this.thirdpartyRepository.findOne({ id });
    if (!thirdparty) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return thirdparty;
  }

  async findAndCount(): Promise<[ThirdpartyInterface[], number]> {
    return await this.thirdpartyRepository.findAndCount();
  }

  async find(): Promise<ThirdpartyInterface[]> {
    return await this.thirdpartyRepository.find();
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
