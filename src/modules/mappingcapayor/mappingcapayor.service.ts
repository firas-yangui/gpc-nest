import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MappingCaPayorRepository } from './mappingcapayor.repository';
import { MappingCaPayor } from './mappingcapayor.entity';
import nodeExcel from 'excel-export-next';

@Injectable()
export class MappingCaPayorService {
  constructor(
    @InjectRepository(MappingCaPayorRepository)
    private mappingCaPayorRepository: MappingCaPayorRepository,
  ) {}

  getMappingCaPayor() {
    return this.mappingCaPayorRepository.find();
  }

  async setMappingCaPayor(newMappingCaPayor: MappingCaPayor[]) {
    await this.mappingCaPayorRepository.clear();

    return await this.mappingCaPayorRepository.insert(newMappingCaPayor);
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
