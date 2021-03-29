/* eslint-disable no-undef */
import { Logger } from '@nestjs/common';
import { EventSubscriber } from 'typeorm/decorator/listeners/EventSubscriber';
import { EntitySubscriberInterface } from 'typeorm/subscriber/EntitySubscriberInterface';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { Audit } from '../audit/audit.entity';
import { HomeMessageEntity } from './homeMessage.entity';
import { UserService } from './../user/user.service';

// @EventSubscriber()
// export class HomeMessageSubscriber implements EntitySubscriberInterface<HomeMessageEntity> {
//   constructor(private userService: UserService) {}

//   listenTo() {
//     return HomeMessageEntity;
//   }

//   async beforeInsert(event: InsertEvent<HomeMessageEntity>) {
//     try {
//       Logger.log(typeof HomeMessageEntity);
//       Logger.log(HomeMessageEntity);
//       const audit = new Audit();
//       audit.methodName = 'create';
//       audit.modelName = HomeMessageEntity.name;
//       audit.newObject = event.entity;
//       // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

//       Logger.log(`Before Home Message Insertion:`);
//       Logger.log(event.entity);
//       Logger.log(event.queryRunner.data);
//       Logger.log(audit);
//     } catch (error) {
//       Logger.error(error);
//     }
//   }
// }

@EventSubscriber()
export abstract class GenericEntitySubscriber<T = new ([...args]) => any> implements EntitySubscriberInterface<T> {
  constructor(private userService: UserService) {}

  listenTo() {
    return T;
  }

  async beforeInsert(event: InsertEvent<T>) {
    const audit = new Audit();
    audit.methodName = 'create';
    audit.modelName = T.name;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audit.newObject = event.entity as Record<string, any>;
    // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

    Logger.log(`Before Home Message Insertion:`);
    Logger.log(event.entity);
    Logger.log(event.queryRunner.data);
    Logger.log(audit);
  }
}
