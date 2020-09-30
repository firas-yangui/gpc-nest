import * as moment from 'moment-ferie-fr';
import { indexOf } from 'lodash';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MomentFerieManager {
  isBusinessDay(day) {
    const daay = day.day();
    if (!(indexOf([0, 6], daay) == -1)) return false;

    if (day.isFerie()) return false;

    return true;
  }

  getNumberOfBusinessDayInMonth(day) {
    if (!this.isBusinessDay(day)) return false;

    const start = day.clone().startOf('month');
    let index = 0;
    const days = moment.duration(start.diff(day)).asDays();

    while (start <= day) {
      if (this.isBusinessDay(start)) {
        index++;
      }
      start.add(1, 'days');
    }
    return index;
  }
}
