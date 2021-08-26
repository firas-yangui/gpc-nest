import { Test, TestingModule } from '@nestjs/testing';
import { PyramidService } from './pyramid.service';
import { RawAmountsService } from '../../rawamounts/rawamounts.service';
import { AmountConverter } from '../../amounts/amounts.converter';
import { CurrencyRateService } from '../../currency-rate/currency-rate.service';
import { WorkloadsService } from '../../workloads/workloads.service';
import { PeriodsService } from '../../periods/periods.service';
import { SubservicesService } from '../../subservices/subservices.service';
import { Workload } from '../../workloads/workload.entity';
import { ThirdpartiesService } from '../../thirdparties/thirdparties.service';
import { Thirdparty } from '../../thirdparties/thirdparty.entity';
import { SubsidiaryAllocation } from '../../subsidiaryallocation/subsidiaryallocation.entity';
import { SubsidiaryallocationService } from '../../subsidiaryallocation/subsidiaryallocation.service';
import { SubtypologiesService } from '../../subtypologies/subtypologies.service';
import { SubnatureService } from '../../subnature/subnature.service';
import { ServicesService } from '../../services/services.service';
import { PricesService } from '../../prices/prices.service';
import { ConstantService } from '../../constants/constants';
import { ImportMappingService } from '../../importmapping/importmapping.service';

import { PeriodType as PeriodTypeInterface } from '../../interfaces/common-interfaces';
import { Subtypology } from '../../subtypologies/subtypology.entity';
import { ActivityService } from '../../activity/activity.service';
import { ActivityThirdPartyService } from '../../activity-thirdparty/activity-thirdparty.service';
import { Activity } from '../../activity/activity.entity';
import { ActivityThirdParty } from '../../activity-thirdparty/activity-thirdparty.entity';
import { iteratee } from 'lodash';

const AmountsModuleMock = { dd: () => {} };
describe('Pyramid.service', () => {
  let service: PyramidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PyramidService,
        { provide: AmountConverter, useValue: {} },
        { provide: RawAmountsService, useValue: {} },
        { provide: WorkloadsService, useValue: {} },
        { provide: ThirdpartiesService, useValue: {} },
        { provide: PeriodsService, useValue: {} },
        { provide: SubservicesService, useValue: {} },
        { provide: ConstantService, useValue: {} },
        { provide: CurrencyRateService, useValue: {} },
        { provide: PricesService, useValue: {} },
        { provide: ImportMappingService, useValue: {} },
        { provide: ActivityThirdPartyService, useValue: {} },
        { provide: ActivityService, useValue: {} },
        { provide: SubtypologiesService, useValue: {} },
        { provide: SubsidiaryallocationService, useValue: {} },
        { provide: ServicesService, useValue: {} },
        { provide: SubnatureService, useValue: {} },
      ],
    }).compile();

    service = module.get<PyramidService>(PyramidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isValidParams', () => {
    const line = { a: '1', b: '2', c: '3', d: '', e: null, f: undefined };

    it('all fields exist, should return true', () => {
      const requiredFields = ['a', 'b', 'c'];
      const res = service.isValidParams(requiredFields, line);
      expect(res).toBe(true);
    });

    it("d field is '' should return false", () => {
      const requiredFields = ['a', 'b', 'c', 'd'];
      const res = service.isValidParams(requiredFields, line);
      expect(res).toBe(false);
    });

    it('e is null, should return false', () => {
      const requiredFields = ['e', 'a', 'b', 'c'];
      const res = service.isValidParams(requiredFields, line);
      expect(res).toBe(false);
    });

    it('f is undefined, should return false', () => {
      const requiredFields = ['a', 'b', 'f', 'c'];
      const res = service.isValidParams(requiredFields, line);
      expect(res).toBe(false);
    });

    it("g doesn't exist , should return false", () => {
      const requiredFields = ['a', 'g', 'b', 'c'];
      const res = service.isValidParams(requiredFields, line);
      expect(res).toBe(false);
    });
  });

  describe('isParseableLine', () => {
    const fields = { cds: 'cds', caPayor: 'caPayor', activityType: 'activityType', curveType: 'curveType' };
    let line, outsourcing;
    it('should return true', () => {
      line = { cds: 'cds', caPayor: 'caPayor', activityType: 'activityType', curveType: 'curveType' };
      outsourcing = false;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(true);
    });

    it('cds is RESG/TPS/API, should return false', () => {
      line = { cds: 'RESG/TPS/API', caPayor: 'caPayor', activityType: 'activityType', curveType: 'curveType' };
      outsourcing = false;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(false);
    });

    it('cds is RESG/TPS/GDO, should return false', () => {
      line = { cds: 'RESG/TPS/GDO', caPayor: 'caPayor', activityType: 'activityType', curveType: 'curveType' };
      outsourcing = false;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(false);
    });

    it('cds is RISQ/DTO, should return false', () => {
      line = { cds: 'RISQ/DTO', caPayor: 'caPayor', activityType: 'activityType', curveType: 'curveType' };
      outsourcing = false;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(false);
    });

    it('caPayor is 3000324000, should return false', () => {
      line = { cds: 'cds', caPayor: '3000324000', activityType: 'activityType', curveType: 'curveType' };
      outsourcing = false;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(false);
    });

    it('activityType is Absence, should return false', () => {
      line = { cds: 'cds', caPayor: 'caPayor', activityType: 'Absence', curveType: 'curveType' };
      outsourcing = false;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(false);
    });

    it('outsourcing true and curveType is actuals, should return true', () => {
      line = { cds: 'cds', caPayor: 'caPayor', activityType: 'activityType', curveType: 'actuals' };
      outsourcing = true;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(true);
    });

    it('outsourcing true and curveType is not actuals, should return false', () => {
      line = { cds: 'cds', caPayor: 'caPayor', activityType: 'activityType', curveType: 'curveType' };
      outsourcing = true;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(false);
    });

    it('outsourcing false and curveType is actuals, should return true', () => {
      line = { cds: 'cds', caPayor: 'caPayor', activityType: 'activityType', curveType: 'ACTUALS' };
      outsourcing = false;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(true);
    });
  });

  describe('isKLC', () => {
    const validStaffTypes = [
      'gbsu - contribution',
      'itim - contribution',
      'other - contribution',
      'gts - hosting and client request',
      'irbs - contribution',
      'software acquisition',
      'gts - client projects',
      'it rental and maintenance',
      'travels',
      'other',
      'outsourcing - consulting',
      'outsourcing - fixed-price contract',
      'restatement',
    ];

    for (const staffType of validStaffTypes) {
      it(`${staffType} is valid, should return true`, () => {
        const res = service.isKLC(staffType);
        expect(res).toBe(true);
      });
    }

    it(' unvalidStaffType is unvalid, should return false', () => {
      const unvalidStaffType = 'unvalidStaffType';
      const res = service.isKLC(unvalidStaffType);
      expect(res).toBe(false);
    });
  });

  describe('isJH', () => {
    const validStaffTypes = ['internal', 'external', 'onshore', 'nearshore', 'offshore'];

    for (const staffType of validStaffTypes) {
      it(`${staffType} is valid, should return true`, () => {
        const res = service.isJH(staffType);
        expect(res).toBe(true);
      });
    }

    it('unvalidStaffType is unvalid, should return false', () => {
      const unvalidStaffType = 'unvalidStaffType';
      const res = service.isJH(unvalidStaffType);
      expect(res).toBe(false);
    });
  });
});
