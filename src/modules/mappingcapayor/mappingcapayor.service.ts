import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MappingCaPayorRepository } from './mappingcapayor.repository';
import { MappingCaPayor } from './mappingcapayor.entity';
/* eslint @typescript-eslint/no-var-requires: "off" */
const nodeExcel = require('excel-export-next');

@Injectable()
export class MappingCaPayorService {
  constructor(
    @InjectRepository(MappingCaPayorRepository)
    private mappingCaPayorRepository: MappingCaPayorRepository,
  ) {}

  getMappingCaPayor(option = {}) {
    return this.mappingCaPayorRepository.find(option);
  }

  findOne(option = {}) {
    return this.mappingCaPayorRepository.findOne(option);
  }

  async setMappingCaPayor(newMappingCaPayors: MappingCaPayor[]) {
    await this.mappingCaPayorRepository.query(`
      TRUNCATE TABLE ca_payor RESTART IDENTITY RESTRICT;
    `);

    for (const { codeCaPayor, id, libelleCaPayor, partnerTrigram } of newMappingCaPayors) {
      await this.mappingCaPayorRepository.query(`
        INSERT INTO public.ca_payor (${id ? 'id,' : ''}code_ca_payor,libelle_ca_payor,partner_trigram)
        VALUES (${id ? id + ',' : ''}'${codeCaPayor}','${libelleCaPayor}','${partnerTrigram}');
      `);
    }

    return this.getMappingCaPayor();
  }

  async exportMappingCaPayor(res) {
    try {
      const fileName = 'mapping_ca_payor.xlsx';
      const sheetName = 'mapping_ca_payor';
      // Create a new instance of a Workbook class
      const MAPPINGCAPAYORCOLUMNS = ['codeCaPayor', 'libelleCaPayor', 'partnerTrigram'];
      const columns = MAPPINGCAPAYORCOLUMNS.map(column => ({
        caption: column,
        type: 'string',
      }));

      const data = await this.getMappingCaPayor().then(res => res.map(line => MAPPINGCAPAYORCOLUMNS.map(header => line[header])));
      const result = nodeExcel.execute({
        name: sheetName,
        cols: columns,
        rows: data,
      });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
      res.end(result, 'binary');
    } catch (err) {
      Logger.error(err);
      return res.status(500).send({ err });
    }
  }
}
