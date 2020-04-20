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
const separator = '|@|';
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

  private writeInRejectedFile = (line: string, error: string) => {
    writeStream.write(line.concat(separator, error));
  };

  nosicaCallback = async (line: any[]) => {
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
      this.writeInRejectedFile('Global rejection', error);
      writeStream.end();
      process.exit(1);
    }

    const thirdparty: Thirdparty = await this.thirdpartiesService.findOne({ radical: Like(receivedSakarahCode) });

    if (!thirdparty) {
      error = `No Thirdparty found for Sakarah Code : ${receivedSakarahCode}`;
      Logger.error(error);
      this.writeInRejectedFile(line.join(separator), error);
      return;
    }

    const subnatureappsetting = await this.subnatureappsettingsService.findOne({ nrgcode: Like(receivedNRGCode), relations: ['subnature'] });

    if (!subnatureappsetting) {
      error = `No Subnature found with NRG Code : ${receivedNRGCode}`;
      Logger.error(error);
      this.writeInRejectedFile(line.join(separator), error);
      return;
    }

    const actualPeriod = await this.periodsService.findOne(null, { year: receivedYear, month: receivedMonth, type: Like(PeriodType.actual) });
    if (!actualPeriod) {
      error = `No Period found with year  ${receivedYear} and month ${receivedMonth} and type ${PeriodType.actual}`;
      Logger.error(error);
      this.writeInRejectedFile(line.join(separator), error);
      return;
    }

    const workload = this.getWorkloadByNrgAndSakarah(nosicaWorkloads, subnatureappsetting.subnature.id, thirdparty.id);
    if (!workload) {
      error = `No workload match with subnature ID   ${subnatureappsetting.subnature.id} and thirdparty ID ${thirdparty.id}`;
      Logger.error(error);
      this.writeInRejectedFile(line.join(separator), error);
      return;
    }
    const amountObject: Amount = {
      keuros: 0,
      keurossales: 0,
      klocalcurrency: 0,
      mandays: amount,
      periodid: actualPeriod.id,
      workloadid: workload.id,
    };

    return this.amountsService.save([amountObject], { reloead: false });
  };

  endNosicaCallback = () => {
    writeStream.end();
  };
}
