import { Logger } from '@nestjs/common';
import { EventSubscriber } from 'typeorm/decorator/listeners/EventSubscriber';
import { EntitySubscriberInterface } from 'typeorm/subscriber/EntitySubscriberInterface';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { UpdateEvent } from 'typeorm/subscriber/event/UpdateEvent';
import { RemoveEvent } from 'typeorm/subscriber/event/RemoveEvent';
import { Audit } from '../audit/audit.entity';
import { AuditService } from '../audit/audit.service';
import { UserService } from '../user/user.service';
import { SubService } from './subservice.entity';

@EventSubscriber()
export class SubserviceSubscriber implements EntitySubscriberInterface<SubService> {
  constructor(private auditSubservice: AuditService, private userService: UserService) {}

  listenTo() {
    return SubService;
  }

  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<SubService>) {
    try {
      const audit = new Audit();
      audit.methodName = 'create';
      audit.modelName = SubService.name;
      audit.newObject = event.entity;
      // audit.user = await this.userSubservice.getUserById(event.queryRunner.data.userId);

      this.auditSubservice.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }

  beforeUpdate(event: UpdateEvent<SubService>) {
    try {
      const audit = new Audit();
      audit.methodName = 'update';
      audit.modelName = SubService.name;
      audit.oldObject = event.databaseEntity;
      audit.newObject = event.entity;
      // audit.user = await this.userSubservice.getUserById(event.queryRunner.data.userId);

      this.auditSubservice.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }

  beforeRemove(event: RemoveEvent<SubService>) {
    try {
      const audit = new Audit();
      audit.methodName = 'delete';
      audit.modelName = SubService.name;
      audit.oldObject = event.databaseEntity;
      // audit.user = await this.userSubservice.getUserById(event.queryRunner.data.userId);

      this.auditSubservice.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }
}
