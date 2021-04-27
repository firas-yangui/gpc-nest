import { Logger } from '@nestjs/common';
import { EventSubscriber } from 'typeorm/decorator/listeners/EventSubscriber';
import { EntitySubscriberInterface } from 'typeorm/subscriber/EntitySubscriberInterface';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';
import { UpdateEvent } from 'typeorm/subscriber/event/UpdateEvent';
import { RemoveEvent } from 'typeorm/subscriber/event/RemoveEvent';
import { Audit } from '../audit/audit.entity';
import { AuditService } from '../audit/audit.service';
import { UserService } from '../user/user.service';
import { SubsidiaryAllocation } from './subsidiaryallocation.entity';

@EventSubscriber()
export class SubsidiaryAllocationSubscriber implements EntitySubscriberInterface<SubsidiaryAllocation> {
  constructor(private auditService: AuditService, private userService: UserService) {}

  listenTo() {
    return SubsidiaryAllocation;
  }

  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<SubsidiaryAllocation>) {
    try {
      const audit = new Audit();
      audit.methodName = 'create';
      audit.modelName = SubsidiaryAllocation.name;
      audit.newObject = event.entity;
      // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

      this.auditService.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }

  beforeUpdate(event: UpdateEvent<SubsidiaryAllocation>) {
    try {
      const audit = new Audit();
      audit.methodName = 'update';
      audit.modelName = SubsidiaryAllocation.name;
      audit.oldObject = event.databaseEntity;
      audit.newObject = event.entity;
      // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

      this.auditService.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }

  beforeRemove(event: RemoveEvent<SubsidiaryAllocation>) {
    try {
      const audit = new Audit();
      audit.methodName = 'delete';
      audit.modelName = SubsidiaryAllocation.name;
      audit.oldObject = event.databaseEntity;
      // audit.user = await this.userService.getUserById(event.queryRunner.data.userId);

      this.auditService.save(audit);
    } catch (error) {
      Logger.error(error);
    }
  }
}
