import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ThirdpartyRepository } from './thirdparties.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Thirdparty as ThirdpartyInterface } from './../interfaces/common-interfaces';
import * as _ from 'lodash';

@Injectable()
export class ThirdpartiesService {
  public thirdpartyChilds: number[];
  constructor(
    @InjectRepository(ThirdpartyRepository)
    private thirdpartyRepository: ThirdpartyRepository,
  ) {
    this.thirdpartyChilds = [];
  }

  public async getThirdPartyById(id: number) {
    const thirdparty = await this.thirdpartyRepository.findOne({ id });
    if (!thirdparty) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return thirdparty;
  }

  async findAndCount(): Promise<[ThirdpartyInterface[], number]> {
    return await this.thirdpartyRepository.findAndCount();
  }

  async find(options: object = {}): Promise<ThirdpartyInterface[]> {
    return await this.thirdpartyRepository.find(options);
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
