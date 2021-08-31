import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CaPayorRepository } from './capayor.repository';
import { CaPayor } from './capayor.entity';
/* eslint @typescript-eslint/no-var-requires: "off" */
const nodeExcel = require('excel-export-next');

@Injectable()
export class CaPayorService {
  constructor(
    @InjectRepository(CaPayorRepository)
    private caPayorRepository: CaPayorRepository,
  ) {}

  async getCaPayor() {
    return this.caPayorRepository.find();
  }

  async findOne(options: object = {}): Promise<CaPayor> {
    return await this.caPayorRepository.findOne(options);
  }

  async setCaPayor(newCaPayors: CaPayor[]) {
    await this.caPayorRepository.query(`
      TRUNCATE TABLE ca_payor RESTART IDENTITY RESTRICT;
    `);

    for (const { codeCaPayor, id, libelleCaPayor, partnerTrigram } of newCaPayors) {
      await this.caPayorRepository.query(`
        INSERT INTO public.ca_payor (${id ? 'id,' : ''}code_ca_payor,libelle_ca_payor,partner_trigram)
        VALUES (${id ? id + ',' : ''}'${codeCaPayor}','${libelleCaPayor}','${partnerTrigram}');
      `);
    }

    return this.getCaPayor();
  }

  async exportCaPayor(res) {
    try {
      const fileName = 'mapping_ca_payor.xlsx';
      const sheetName = 'mapping_ca_payor';
      // Create a new instance of a Workbook class
      const MAPPINGCAPAYORCOLUMNS = ['codeCaPayor', 'libelleCaPayor', 'partnerTrigram'];
      const columns = MAPPINGCAPAYORCOLUMNS.map(column => ({
        caption: column,
        type: 'string',
      }));

      const data = await this.getCaPayor().then(res => res.map(line => MAPPINGCAPAYORCOLUMNS.map(header => line[header])));
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
