import { Logger } from '@nestjs/common';
import { EventSubscriber } from 'typeorm/decorator/listeners/EventSubscriber';
import { EntitySubscriberInterface } from 'typeorm/subscriber/EntitySubscriberInterface';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { UpdateEvent } from 'typeorm/subscriber/event/UpdateEvent';
import { RemoveEvent } from 'typeorm/subscriber/event/RemoveEvent';
import { Audit } from '../audit/audit.entity';
import { AuditService } from '../audit/audit.service';
import { UserService } from '../user/user.service';
import { Service } from './services.entity';

@EventSubscriber()
export class ServiceSubscriber implements EntitySubscriberInterface<Service> {
  constructor(private auditService: AuditService, private userService: UserService) {}

  listenTo() {
    return Service;
  }

  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<Service>) {
    try {
      const audit = new Audit();
      audit.methodName = 'create';
      audit.modelName = Service.name;
      audit.newObject = event.entity;
      // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

      this.auditService.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }

  beforeUpdate(event: UpdateEvent<Service>) {
    try {
      const audit = new Audit();
      audit.methodName = 'update';
      audit.modelName = Service.name;
      audit.oldObject = event.databaseEntity;
      audit.newObject = event.entity;
      // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

      this.auditService.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }

  beforeRemove(event: RemoveEvent<Service>) {
    try {
      const audit = new Audit();
      audit.methodName = 'delete';
      audit.modelName = Service.name;
      audit.oldObject = event.databaseEntity;
      // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

      this.auditService.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }
}
