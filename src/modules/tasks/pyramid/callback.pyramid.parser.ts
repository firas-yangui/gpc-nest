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

const bscTarget = {
  BSC_AC: 'Activités Transverses BSC',
  // eslint-disable-next-line @typescript-eslint/camelcase
  BSC_OdS: 'Offres de services BSC',
  BSC_TRA: 'Transformation BSC',
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

  getBSCTarget = line => {
    for (const key in bscTarget) {
      const target = bscTarget[key];
      if (line[pyramidFields.portfolio].toLowerCase().trim() == target.toLowerCase().trim()) {
        return key;
      }
    }
  };

  getPartner = line => {
    if (line[pyramidFields.partner].toUpperCase().trim() == 'NA') {
      return 'BSC_AC';
    }
    return line[pyramidFields.partner];
  };

  parse = async (line: any) => {
    if (!this.isValidParams(line)) {
      return;
    }
    const bscTarget = this.getBSCTarget(line);
    if (!bscTarget) {
      return;
    }
  };
  end = () => {};
}
