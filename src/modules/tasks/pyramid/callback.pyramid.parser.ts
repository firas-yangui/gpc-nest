import { createWriteStream } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { Like } from 'typeorm';

import { WorkloadsService } from './../../../modules/workloads/workloads.service';

const pyramidFields = {
  curveType: 'curve_type',
  EAC: 'EAC',
  keuro: 'K€',
  actualsMd: 'Actuals_MD',
  CSM: 'CSM',
  DPG: 'DPG',
  staffType: 'Staff type',
  portfolio: 'Portfolio',
  partner: 'Partner',
  payor: 'Payor',
  clientEntity: 'Client_entity',
  PyrTmpMonthMr: 'Pyr_tmp_month_mr',
};

@Injectable()
export class CallbackPyramidParser {
  constructor(private readonly workloadsService: WorkloadsService) {}

  isValidParams = (line: any) => {
    for (const fieldKey in pyramidFields) {
      if (Object.prototype.hasOwnProperty.call(pyramidFields, fieldKey)) {
        const field = pyramidFields[fieldKey];
        if (!line[field]) return false;
      }
    }
    return true;
  };
  parse = async (line: any) => {
    if (!this.isValidParams(line)) {
      return;
    }
  };
  end = () => {};
}
