import { Logger } from '@nestjs/common';
import { EventSubscriber } from 'typeorm/decorator/listeners/EventSubscriber';
import { EntitySubscriberInterface } from 'typeorm/subscriber/EntitySubscriberInterface';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { UpdateEvent } from 'typeorm/subscriber/event/UpdateEvent';
import { RemoveEvent } from 'typeorm/subscriber/event/RemoveEvent';
import { Audit } from '../audit/audit.entity';
import { AuditService } from '../audit/audit.service';
import { Workload } from './workload.entity';

@EventSubscriber()
export class WorkloadSubscriber implements EntitySubscriberInterface<Workload> {
  constructor(private auditService: AuditService) {}

  listenTo() {
    return Workload;
  }

  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<Workload>) {
    try {
      const audit = new Audit();
      audit.methodName = 'create';
      audit.modelName = Workload.name;
      audit.newObject = event.entity;
      // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

      this.auditService.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }

  beforeUpdate(event: UpdateEvent<Workload>) {
    try {
      const audit = new Audit();
      audit.methodName = 'update';
      audit.modelName = Workload.name;
      audit.oldObject = event.databaseEntity;
      audit.newObject = event.entity;
      // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

      this.auditService.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }

  beforeRemove(event: RemoveEvent<Workload>) {
    try {
      const audit = new Audit();
      audit.methodName = 'delete';
      audit.modelName = Workload.name;
      audit.oldObject = event.databaseEntity;
      // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

      this.auditService.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }
}
