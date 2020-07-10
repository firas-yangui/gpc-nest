import { createWriteStream } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { Like } from 'typeorm';

import { ThirdpartiesService } from './../../../modules/thirdparties/thirdparties.service';
import { WorkloadsService } from './../../../modules/workloads/workloads.service';
import { SubnatureappsettingsService } from './../../../modules/subnatureappsettings/subnatureappsettings.service';
import { PeriodsService } from './../../../modules/periods/periods.service';
import { Thirdparty, Amount, PeriodType } from './../../../modules/interfaces/common-interfaces';
import { AmountsService } from './../../../modules/amounts/amounts.service';

const nosicaField = {
  sakarahCode: 'code_dept_local',
  year: 'fiscal_year',
  period: 'accounting_period',
  NRG: 'sprias',
  amount: 'ytd_amount_eur_currency_wi_adjust',
};

const serviceName = '%activité transverses BSC%';
const rejectedFileName = `nosica-rejected-lines-${Date.now()}.csv`;
const writeStream = createWriteStream(`/tmp/${rejectedFileName}`);
@Injectable()
export class CallbackNosicaParser {
  constructor(
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly subnatureappsettingsService: SubnatureappsettingsService,
    private readonly workloadsService: WorkloadsService,
    private readonly periodsService: PeriodsService,
    private readonly amountsService: AmountsService,
  ) {}

  private getWorkloadByNrgAndSakarah = (nosicaWorkloads: any[], SubnaturId, thirdpartyId) => {
    return nosicaWorkloads.find(nosicaWorkload => {
      return nosicaWorkload.thirdparty.id === thirdpartyId && nosicaWorkload.subnature.id === SubnaturId;
    });
  };

  private writeInRejectedFile = (line: string, separator: string, error: string) => {
    writeStream.write(line.concat(separator, error));
  };

  nosicaCallback = async (line: Record<string, any>, separator: string) => {
    const receivedSakarahCode = line[nosicaField.sakarahCode].trim();
    const receivedYear = line[nosicaField.year].trim();
    const receivedNRGCode = line[nosicaField.NRG].trim();
    const receivedMonth = line[nosicaField.period].trim();
    const amount = line[nosicaField.amount].trim();
    let error = '';

    const nosicaWorkloads = await this.workloadsService.getNosicaWorkloadInSubserviceName(serviceName);
    if (!nosicaWorkloads) {
      error = 'No Nosica workload found in database, exit the script.';
      Logger.error(error);
      // this.writeInRejectedFile('Global rejection', separator, error);
      // writeStream.end();
      return;
    }

    const thirdparty: Thirdparty = await this.thirdpartiesService.findOne({ radical: Like(receivedSakarahCode) });

    if (!thirdparty) {
      error = `No Thirdparty found for Sakarah Code : ${receivedSakarahCode}`;
      Logger.error(error);
      // this.writeInRejectedFile(line, separator, error);
      return;
    }

    const subnatureappsetting = await this.subnatureappsettingsService.findOne({ nrgcode: Like(receivedNRGCode), relations: ['subnature'] });

    if (!subnatureappsetting) {
      error = `No Subnature found with NRG Code : ${receivedNRGCode}`;
      Logger.error(error);
      // this.writeInRejectedFile(line, separator, error);
      return;
    }

    const actualPeriod = await this.periodsService.findOne(null, { year: receivedYear, month: receivedMonth, type: Like(PeriodType.actual) });
    if (!actualPeriod) {
      error = `No Period found with year  ${receivedYear} and month ${receivedMonth} and type ${PeriodType.actual}`;
      Logger.error(error);
      // this.writeInRejectedFile(line, separator, error);
      return;
    }

    const workload = this.getWorkloadByNrgAndSakarah(nosicaWorkloads, subnatureappsetting.subnature.id, thirdparty.id);
    if (!workload) {
      error = `No workload match with subnature ID   ${subnatureappsetting.subnature.id} and thirdparty ID ${thirdparty.id}`;
      Logger.error(error);
      // this.writeInRejectedFile(line, separator, error);
      return;
    }

    //getAmount by Period and Workload

    const amountObject: Amount = {
      keuros: 0,
      keurossales: 0,
      klocalcurrency: 0,
      mandays: amount,
      period: actualPeriod,
      workload: workload,
    };

    const amountByPeriodAndWorkloadID = await this.amountsService.findOne({ period: actualPeriod, workload: workload });
    if (amountByPeriodAndWorkloadID) {
      amountObject.id = amountByPeriodAndWorkloadID.id;
    }

    return this.amountsService.save(amountObject, { reload: false });
  };

  endNosicaCallback = () => {
    writeStream.end();
  };
}
