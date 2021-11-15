/* eslint-disable @typescript-eslint/camelcase */
import { Test, TestingModule } from '@nestjs/testing';

import { In, Equal, MoreThan } from 'typeorm';
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
import { ActivityCapayorService } from '../../activity-capayor/activity-capayorservice';
import { Activity } from '../../activity/activity.entity';
import { CaPayorService } from '../../capayor/capayor.service';
import { iteratee } from 'lodash';
import * as moment from 'moment';

describe('Pyramid.service', () => {
  let service: PyramidService;

  const createService = async (useValue = {}) => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PyramidService,
        { provide: AmountConverter, useValue },
        { provide: RawAmountsService, useValue },
        { provide: WorkloadsService, useValue },
        { provide: ThirdpartiesService, useValue },
        { provide: PeriodsService, useValue },
        { provide: SubservicesService, useValue },
        { provide: ConstantService, useValue },
        { provide: CurrencyRateService, useValue },
        { provide: PricesService, useValue },
        { provide: ImportMappingService, useValue },
        { provide: ActivityCapayorService, useValue },
        { provide: ActivityService, useValue },
        { provide: SubtypologiesService, useValue },
        { provide: SubsidiaryallocationService, useValue },
        { provide: ServicesService, useValue },
        { provide: SubnatureService, useValue },
        { provide: CaPayorService, useValue },
      ],
    }).compile();

    service = module.get<PyramidService>(PyramidService);
  };
  beforeEach(async () => {
    await createService();
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

    it('outsourcing true and curveType is undefined, should return false', () => {
      line = { cds: 'cds', caPayor: 'caPayor', activityType: 'activityType' };
      outsourcing = true;
      const res = service.isParseableLine(line, fields, outsourcing);
      expect(res).toBe(false);
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

  describe('isChargeableLine', () => {
    const valideStaffType = ['type1', 'type2', 'type3'];
    const staffType = 'staffType';
    const fields = { valideStaffType, staffType };

    it('line1 should return true', () => {
      const line1 = { staffType: 'TYPE1' };
      const res = service.isChargeableLine(line1, fields);
      expect(res).toBe(true);
    });

    it('line2 should return true', () => {
      const line2 = { staffType: 'type2' };
      const res = service.isChargeableLine(line2, fields);
      expect(res).toBe(true);
    });

    it('line3 should return false', () => {
      const line3 = { staffType: 'invalidType' };
      const res = service.isChargeableLine(line3, fields);
      expect(res).toBe(false);
    });
  });

  describe('getSubtypologyByCode', () => {
    it('should return OK', async () => {
      const codes = ['code1', 'code2'];
      const mockFn = jest.fn().mockResolvedValueOnce('OK');

      await createService({ findByCodes: mockFn });

      const res = await service.getSubtypologyByCode(codes);

      expect(res).toBe('OK');
      expect(mockFn).toBeCalledWith(codes);
    });

    it('should throw Error', async () => {
      const codes = ['code1', 'code2'];
      const mockFn = jest.fn().mockRejectedValueOnce('Error');
      await createService({ findByCodes: mockFn });

      await service.getSubtypologyByCode(codes).catch(res => {
        expect(res).toBe('Error');
      });

      expect(mockFn).toBeCalledWith(codes);
    });
  });

  describe('getPlanCode', () => {
    it("should return ['P1', 'T1']", () => {
      const res = service.getPlanCode('Project');
      expect(res).toStrictEqual(['P1', 'T1']);
    });

    it('should return correct Plan code', () => {
      const plans = {
        35: 'Structure',
        12: 'Evolutive Maintenance',
        58: 'Run activities',
        13: 'Tech Plan',
      };

      for (const planCode in plans) {
        const res = service.getPlanCode(plans[planCode]);
        expect(res).toStrictEqual([planCode]);
      }
    });

    it('should return undefined', () => {
      const res = service.getPlanCode('other');
      expect(res).toStrictEqual([undefined]);
    });
  });

  describe('getServiceByPortfolioName', () => {
    it('should return OK', async () => {
      const portfolioName = 'portfolioName';
      const mockFn = jest.fn().mockResolvedValueOnce('OK');
      await createService({ findByName: mockFn });

      const res = await service.getServiceByPortfolioName(portfolioName);

      expect(res).toBe('OK');
      expect(mockFn).toBeCalledWith(portfolioName);
    });

    it('should throw Error', async () => {
      const portfolioName = 'portfolioName';
      const mockFn = jest.fn().mockRejectedValueOnce('Error');
      await createService({ findByName: mockFn });

      await service.getServiceByPortfolioName(portfolioName).catch(res => {
        expect(res).toBe('Error');
      });
      expect(mockFn).toBeCalledWith(portfolioName);
    });
  });

  describe('getThirdparty', () => {
    it('should return Thirdparty', async () => {
      const line = { csm: 'csm' };
      const fields = { csm: 'csm' };
      const mockFn = jest.fn().mockResolvedValueOnce('Thirdparty');
      await createService({ findOne: mockFn });

      const res = await service.getThirdparty(line, fields);

      expect(res).toBe('Thirdparty');
      expect(mockFn).toBeCalledWith({ name: 'csm' });
    });

    it('should return 123/456', async () => {
      const line = { csm: 'csm', parentDescr: '123/456/789/012' };
      const fields = { csm: 'csm', parentDescr: 'parentDescr' };
      const mockFn1 = jest.fn().mockResolvedValueOnce(false);
      const mockFn2 = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce('123/456');

      await createService({ findOne: mockFn1, getMapping: mockFn2 });

      const res = await service.getThirdparty(line, fields);

      expect(res).toBe('123/456');
      expect(mockFn1).toBeCalledWith({ name: 'csm' });
      expect(mockFn2).toHaveBeenCalledTimes(3);
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456/789/012');
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456/789');
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456');
    });

    it('should return 123/456/789', async () => {
      const line = { csm: 'csm', parentDescr: '123/456/789/012' };
      const fields = { csm: 'csm', parentDescr: 'parentDescr' };
      const mockFn1 = jest.fn().mockResolvedValueOnce(false);
      const mockFn2 = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce('123/456/789');

      await createService({ findOne: mockFn1, getMapping: mockFn2 });

      const res = await service.getThirdparty(line, fields);

      expect(res).toBe('123/456/789');
      expect(mockFn1).toBeCalledWith({ name: 'csm' });
      expect(mockFn2).toHaveBeenCalledTimes(2);
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456/789/012');
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456/789');
      expect(mockFn2).not.toBeCalledWith('PYRAMID', 'ORGA', '123/456');
    });

    it('should return 123/456/789/012', async () => {
      const line = { csm: 'csm', parentDescr: '123/456/789/012' };
      const fields = { csm: 'csm', parentDescr: 'parentDescr' };
      const mockFn1 = jest.fn().mockResolvedValueOnce(false);
      const mockFn2 = jest.fn().mockResolvedValueOnce('123/456/789/012');

      await createService({ findOne: mockFn1, getMapping: mockFn2 });

      const res = await service.getThirdparty(line, fields);

      expect(res).toBe('123/456/789/012');
      expect(mockFn1).toBeCalledWith({ name: 'csm' });
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456/789/012');
      expect(mockFn2).not.toBeCalledWith('PYRAMID', 'ORGA', '123/456/789');
      expect(mockFn2).not.toBeCalledWith('PYRAMID', 'ORGA', '123/456');
    });

    it('should return null', async () => {
      const line = { csm: 'csm', parentDescr: '123/456/789/012' };
      const fields = { csm: 'csm', parentDescr: 'parentDescr' };
      const mockFn1 = jest.fn().mockResolvedValueOnce(false);
      const mockFn2 = jest.fn().mockResolvedValue(false);

      await createService({ findOne: mockFn1, getMapping: mockFn2 });

      const res = await service.getThirdparty(line, fields);

      expect(res).toBe(null);
      expect(mockFn1).toBeCalledWith({ name: 'csm' });
      expect(mockFn2).toHaveBeenCalledTimes(3);
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456/789/012');
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456/789');
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456');
    });

    it('should throw Error', async () => {
      const line = { csm: 'csm', parentDescr: '123/456/789/012' };
      const fields = { csm: 'csm', parentDescr: 'parentDescr' };
      const mockFn1 = jest.fn().mockResolvedValueOnce(false);
      const mockFn2 = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockRejectedValueOnce('Error');

      await createService({ findOne: mockFn1, getMapping: mockFn2 });

      await service.getThirdparty(line, fields).catch(err => {
        expect(err).toBe('Error');
      });

      expect(mockFn1).toBeCalledWith({ name: 'csm' });
      expect(mockFn2).toHaveBeenCalledTimes(2);
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456/789/012');
      expect(mockFn2).toBeCalledWith('PYRAMID', 'ORGA', '123/456/789');
      expect(mockFn2).not.toBeCalledWith('PYRAMID', 'ORGA', '123/456');
    });
  });

  describe('getPeriodAppSettings', () => {
    it('should get period M-2 and V2', async () => {
      const type = 'type',
        isActual = true,
        outsourcing = true,
        previous = true,
        isV2 = true;
      const now = moment();
      const month = now.subtract(2, 'month').format('MM');
      const year = now.format('YYYY');
      const mockFn = jest.fn().mockResolvedValueOnce('OK');
      await createService({ findOneInAppSettings: mockFn, GLOBAL_CONST: { SCOPES: { BSC: 'BSC' } } });

      const res = await service.getPeriodAppSettings(type, isActual, outsourcing, previous, isV2);

      expect(res).toBe('OK');

      expect(mockFn).toBeCalledWith('BSC', {
        type,
        year,
        month,
        endWith: '_V2',
      });
    });

    it('should get period M-1', async () => {
      const type = 'type',
        isActual = false,
        outsourcing = true,
        previous = false;
      const now = moment();
      const month = now.subtract(1, 'month').format('MM');
      const year = now.format('YYYY');
      const mockFn = jest.fn().mockResolvedValueOnce('OK');
      await createService({ findOneInAppSettings: mockFn, GLOBAL_CONST: { SCOPES: { BSC: 'BSC' } } });

      const res = await service.getPeriodAppSettings(type, isActual, outsourcing, previous);

      expect(res).toBe('OK');

      expect(mockFn).toBeCalledWith('BSC', {
        type,
        year,
        month,
        endWith: '_',
      });
    });

    it('should getPeriod M', async () => {
      const type = 'type',
        isActual = false,
        outsourcing = false,
        previous = false;
      const now = moment();
      const month = now.format('MM');
      const year = now.format('YYYY');
      const mockFn = jest.fn().mockResolvedValueOnce('OK');
      await createService({ findOneInAppSettings: mockFn, GLOBAL_CONST: { SCOPES: { BSC: 'BSC' } } });

      const res = await service.getPeriodAppSettings(type, isActual, outsourcing, previous);

      expect(res).toBe('OK');

      expect(mockFn).toBeCalledWith('BSC', {
        type,
        year,
        month,
        endWith: '_',
      });
    });

    it('should throw Error', async () => {
      const type = 'type',
        isActual = false,
        outsourcing = false,
        previous = false;
      const now = moment();
      const month = now.format('MM');
      const year = now.format('YYYY');
      const mockFn = jest.fn().mockRejectedValueOnce('Error');
      await createService({ findOneInAppSettings: mockFn, GLOBAL_CONST: { SCOPES: { BSC: 'BSC' } } });

      await service.getPeriodAppSettings(type, isActual, outsourcing, previous).catch(err => {
        expect(err).toBe('Error');
      });

      expect(mockFn).toBeCalledWith('BSC', {
        type,
        year,
        month,
        endWith: '_',
      });
    });
  });

  describe('findSubService', () => {
    it('should return OK', async () => {
      const serviceP: Record<string, any> = { id: 'serviceId' };
      const subtypologies: Subtypology[] = [
        { id: 1, code: 'code', name: 'name', activitytype: 1, businesstype: 'businesstype', subservices: [], subTypologyAppSettings: [] },
        { id: 2, code: 'code', name: 'name', activitytype: 1, businesstype: 'businesstype', subservices: [], subTypologyAppSettings: [] },
      ];
      const projectCode = 'projectCode';
      const mockFn = jest.fn().mockResolvedValueOnce('OK');
      await createService({ findOne: mockFn });

      const res = await service.findSubService(serviceP, subtypologies, projectCode);

      expect(res).toBe('OK');

      expect(mockFn).toHaveBeenCalledWith({
        where: { service: Equal('serviceId'), subtypology: In([1, 2]), code: Equal(projectCode) },
      });
    });

    it('should throw Error', async () => {
      const serviceP: Record<string, any> = { id: 'serviceId' };
      const subtypologies: Subtypology[] = [
        { id: 1, code: 'code', name: 'name', activitytype: 1, businesstype: 'businesstype', subservices: [], subTypologyAppSettings: [] },
        { id: 2, code: 'code', name: 'name', activitytype: 1, businesstype: 'businesstype', subservices: [], subTypologyAppSettings: [] },
      ];
      const projectCode = 'projectCode';
      const mockFn = jest.fn().mockRejectedValueOnce('Error');
      await createService({ findOne: mockFn });

      await service.findSubService(serviceP, subtypologies, projectCode).catch(err => {
        expect(err).toBe('Error');
      });

      expect(mockFn).toHaveBeenCalledWith({
        where: { service: Equal('serviceId'), subtypology: In([1, 2]), code: Equal(projectCode) },
      });
    });
  });

  describe('getAllocations', () => {
    it('should return OK', async () => {
      const otherAttributes = {
        amountStats: [],
        amounts: [],
        code: '',
        description: '',
        status: '',
        thirdparty: undefined,
        subnature: undefined,
        subservice: undefined,
        largedescription: '',
        isenvelope: false,
        isinvested: false,
        personincharge: undefined,
        lasteditdate: new Date(),
        subsidiaryAllocations: [],
        transactionWorkloads: [],
      };
      const workloads: Workload[] = [
        { id: 1, ...otherAttributes },
        { id: 2, ...otherAttributes },
      ];
      const partner = { id: 1 };
      const periodAppSettings: Record<string, any> = { period: { id: 1 } };
      const mockFn = jest.fn().mockResolvedValueOnce('OK');
      await createService({ findOne: mockFn });

      const res = await service.getAllocations(workloads, partner, periodAppSettings);
      expect(res).toBe('OK');
      expect(mockFn).toHaveBeenCalledWith({
        where: { thirdparty: Equal(partner.id), workload: In([1, 2]), period: Equal(1) },
        relations: ['workload', 'workload.subnature'],
      });
    });

    it('should throw Error', async () => {
      const otherAttributes = {
        amountStats: [],
        amounts: [],
        code: '',
        description: '',
        status: '',
        thirdparty: undefined,
        subnature: undefined,
        subservice: undefined,
        largedescription: '',
        isenvelope: false,
        isinvested: false,
        personincharge: undefined,
        lasteditdate: new Date(),
        subsidiaryAllocations: [],
        transactionWorkloads: [],
      };
      const workloads: Workload[] = [
        { id: 1, ...otherAttributes },
        { id: 2, ...otherAttributes },
      ];
      const partner = { id: 1 };
      const periodAppSettings: Record<string, any> = { period: { id: 1 } };
      const mockFn = jest.fn().mockRejectedValueOnce('Error');
      await createService({ findOne: mockFn });

      await service.getAllocations(workloads, partner, periodAppSettings).catch(err => {
        expect(err).toBe('Error');
      });
      expect(mockFn).toHaveBeenCalledWith({
        where: { thirdparty: Equal(partner.id), workload: In([1, 2]), period: Equal(1) },
        relations: ['workload', 'workload.subnature'],
      });
    });
  });

  describe('getGpcDatalakePartner', () => {
    it('should return partner', async () => {
      const line = { partner: 'partner ' };
      const fields = { partner: 'partner' };
      const mockFn = jest.fn().mockResolvedValueOnce('partner');
      await createService({ getMapping: mockFn });

      const res = await service.getGpcDatalakePartner(line, fields);
      expect(res).toBe('partner');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('PYRAMID', 'PARTNER', 'partner');
    });

    it('should return null', async () => {
      const line = { partner: '' };
      const fields = { partner: 'partner' };
      const mockFn = jest.fn().mockResolvedValueOnce('partner');
      await createService({ getMapping: mockFn });

      const res = await service.getGpcDatalakePartner(line, fields);
      expect(res).toBe(null);
      expect(mockFn).toHaveBeenCalledTimes(0);
    });

    it('should return payor', async () => {
      const line = { partner: 'partner ', payor: 'payor ' };
      const fields = { partner: 'partner', payor: 'payor' };
      const mockFn = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('payor');
      await createService({ getMapping: mockFn });

      const res = await service.getGpcDatalakePartner(line, fields);
      expect(res).toBe('payor');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('PYRAMID', 'PARTNER', 'partner');
      expect(mockFn).toHaveBeenCalledWith('PYRAMID', 'PAYOR', 'payor');
    });

    it('should return null', async () => {
      const line = { partner: 'partner ', payor: 'payor ' };
      const fields = { partner: 'partner', payor: 'payor' };
      const mockFn = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      await createService({ getMapping: mockFn });

      const res = await service.getGpcDatalakePartner(line, fields);
      expect(res).toBe(null);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('PYRAMID', 'PARTNER', 'partner');
      expect(mockFn).toHaveBeenCalledWith('PYRAMID', 'PAYOR', 'payor');
    });

    it('should return null', async () => {
      const line = { partner: 'partner ', payor: '' };
      const fields = { partner: 'partner', payor: 'payor' };
      const mockFn = jest.fn().mockResolvedValueOnce(null);
      await createService({ getMapping: mockFn });

      const res = await service.getGpcDatalakePartner(line, fields);
      expect(res).toBe(null);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('PYRAMID', 'PARTNER', 'partner');
    });

    it('should throw Error', async () => {
      const line = { partner: 'partner ', payor: 'payor ' };
      const fields = { partner: 'partner', payor: 'payor' };
      const mockFn = jest.fn().mockRejectedValueOnce('Error');
      await createService({ getMapping: mockFn });

      await service.getGpcDatalakePartner(line, fields).catch(err => {
        expect(err).toBe('Error');
      });
    });
  });

  describe('findWorkloadBySubserviceThirdpartySubnature', () => {
    it('should return OK', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('OK');
      await createService({ find: mockFn });
      const res = await service.findWorkloadBySubserviceThirdpartySubnature({ id: 1 }, { id: 2 }, { id: 3 });
      expect(res).toBe('OK');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        relations: ['subnature', 'subservice', 'thirdparty'],
        where: {
          subnature: 1,
          subservice: 2,
          thirdparty: 3,
        },
      });
    });

    it('should throw Error', async () => {
      const mockFn = jest.fn().mockRejectedValueOnce('Error');
      await createService({ find: mockFn });
      await service.findWorkloadBySubserviceThirdpartySubnature({ id: 1 }, { id: 2 }, { id: 3 }).catch(err => {
        expect(err).toBe('Error');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        relations: ['subnature', 'subservice', 'thirdparty'],
        where: {
          subnature: 1,
          subservice: 2,
          thirdparty: 3,
        },
      });
    });
  });

  describe('getAmountData', () => {
    it('should return {amount:"amount",unit:"MD"}', async () => {
      await createService({ GLOBAL_CONST: { AMOUNT_UNITS: { MD: 'MD' } } });
      const line = { standard_actuals_integrated_md: 'amount' };
      const isActual = true;

      service.isJH = jest.fn().mockReturnValueOnce(true);

      const res = await service.getAmountData(line, isActual);

      expect(res).toStrictEqual({ amount: 'amount', unit: 'MD' });
    });

    it('should return {amount:"amount",unit:"KLC"}', async () => {
      await createService({ GLOBAL_CONST: { AMOUNT_UNITS: { KLC: 'KLC' } } });
      const line = { standard_actuals_integrated_md: 'amount' };
      const isActual = true;

      service.isJH = jest.fn().mockReturnValueOnce(false);
      service.isKLC = jest.fn().mockReturnValueOnce(true);

      const res = await service.getAmountData(line, isActual);

      expect(res).toStrictEqual({ amount: 'amount', unit: 'KLC' });
    });

    it('should return undefined', async () => {
      await createService({ GLOBAL_CONST: { AMOUNT_UNITS: { KLC: 'KLC' } } });
      const line = { standard_actuals_integrated_md: 'amount' };
      const isActual = true;

      service.isJH = jest.fn().mockReturnValueOnce(false);
      service.isKLC = jest.fn().mockReturnValueOnce(false);

      const res = await service.getAmountData(line, isActual);

      expect(res).toBe(undefined);
    });

    it('should return {amount:"5.5",unit:"MD"}', async () => {
      await createService({ GLOBAL_CONST: { AMOUNT_UNITS: { MD: 'MD' } } });
      const line = { eac: '5.5' };
      const isActual = false;

      service.isJH = jest.fn().mockReturnValueOnce(true);

      const res = await service.getAmountData(line, isActual);

      expect(res).toStrictEqual({ amount: '5.5', unit: 'MD' });
    });

    it('should return {amount:"5.5",unit:"KLC"}', async () => {
      await createService({ GLOBAL_CONST: { AMOUNT_UNITS: { KLC: 'KLC' } } });
      const line = { eac_ke: '5,5' };
      const isActual = false;

      service.isJH = jest.fn().mockReturnValueOnce(false);
      service.isKLC = jest.fn().mockReturnValueOnce(true);

      const res = await service.getAmountData(line, isActual);

      const res2 = (parseFloat(res.amount) * 20) / 100;
      expect(res2).toStrictEqual(1.1);

      expect(res).toStrictEqual({ amount: '5.5', unit: 'KLC' });
    });

    it('should return {amount:"amount",unit:"KLC"}', async () => {
      await createService({ GLOBAL_CONST: { AMOUNT_UNITS: { KLC: 'KLC' } } });
      const line = { eac_ke: 'amount' };
      const isActual = false;

      service.isJH = jest.fn().mockReturnValueOnce(false);
      service.isKLC = jest.fn().mockReturnValueOnce(false);

      const res = await service.getAmountData(line, isActual);

      expect(res).toBe(undefined);
    });
  });

  describe('projectCode', () => {
    const testparams = [
      { in: ' a ', out: '0000a' },
      { in: ' aa ', out: '000aa' },
      { in: 'aaa ', out: '00aaa' },
      { in: ' aaaa', out: '0aaaa' },
      { in: 'aaaaa', out: 'aaaaa' },
      { in: '', out: '' },
      { in: 'verylongformat', out: 'verylongformat' },
    ];
    let res;

    for (const param of testparams) {
      it(`it should return "${param.out}"`, () => {
        res = service.formatProjectCode(param.in);
        expect(res).toBe(param.out);
      });
    }
  });

  describe('createWorkload', () => {
    it('should return OK', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('OK');
      const mockFn2 = jest.fn().mockResolvedValueOnce('Auto');

      await createService({ save: mockFn, generateCode: mockFn2 });
      const res = await service.createWorkload({});
      expect(res).toBe('OK');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        code: 'Auto',
        description: 'Auto',
      });

      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith('AUTO');
    });

    it('should throw Error', async () => {
      const mockFn = jest.fn().mockRejectedValueOnce('Error');
      const mockFn2 = jest.fn().mockResolvedValueOnce('Auto');

      await createService({ save: mockFn, generateCode: mockFn2 });
      await service.createWorkload({}).catch(err => {
        expect(err).toBe('Error');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        code: 'Auto',
        description: 'Auto',
      });

      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith('AUTO');
    });

    it('should throw Error', async () => {
      const mockFn2 = jest.fn().mockRejectedValueOnce('Error');
      const mockFn = jest.fn().mockResolvedValueOnce('Auto');

      await createService({ save: mockFn, generateCode: mockFn2 });
      await service.createWorkload({}).catch(err => {
        expect(err).toBe('Error');
      });
      expect(mockFn).toHaveBeenCalledTimes(0);
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith('AUTO');
    });
  });

  describe('getPartners', () => {
    const activityCode = 'activityCode';
    it('should throw "no activity found for activityCode activityCode"', async () => {
      const mockFn = jest.fn().mockResolvedValue(null);

      await createService({ findOne: mockFn });
      await service.getPartners(activityCode).catch(err => {
        expect(err).toBe('no activity found for activityCode ' + activityCode);
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        where: { activityCode },
      });
    });

    it('should throw "no activity found for activityCode exponentialActivityCode"', async () => {
      const mockFn = jest.fn().mockResolvedValue(null);
      const exponentialActivityCode = '1234,34e+12';
      await createService({ findOne: mockFn });
      await service.getPartners(exponentialActivityCode).catch(err => {
        expect(err).toBe('no activity found for activityCode ' + '1234340000000000');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        where: { activityCode: '1234340000000000' },
      });
    });

    it('should throw "no activity found for activityCode exponentialActivityCode"', async () => {
      const mockFn = jest.fn().mockResolvedValue(null);
      const exponentialActivityCode = '1234.34E+12';
      await createService({ findOne: mockFn });
      await service.getPartners(exponentialActivityCode).catch(err => {
        expect(err).toBe('no activity found for activityCode ' + '1234340000000000');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        where: { activityCode: '1234340000000000' },
      });
    });

    it('should throw Error', async () => {
      const mockFn = jest.fn().mockRejectedValueOnce('Error');

      await createService({ findOne: mockFn });
      await service.getPartners(activityCode).catch(err => {
        expect(err).toBe('Error');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        where: { activityCode },
      });
    });

    it('should throw "no thirdparty found for activityCode activityCode"', async () => {
      const mockFn = jest.fn().mockResolvedValue({ id: 1 });
      const mockFn2 = jest.fn().mockResolvedValue([]);
      await createService({ findOne: mockFn, find: mockFn2 });
      await service.getPartners(activityCode).catch(err => {
        expect(err).toBe('no thirdparty found for activityCode ' + activityCode);
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        where: { activityCode },
      });
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith({
        relations: ['activity', 'capayor'],
        where: { activity: { id: 1 }, endDate: MoreThan(moment().format('YYYY-MM-DD')) },
      });
    });

    it('should throw "sum not equal to 100, 200"', async () => {
      const mockFn = jest.fn().mockResolvedValue({ id: 1 });
      const mockFn2 = jest.fn().mockResolvedValue([{ percent: 69.55 }, { percent: 43.45 }, { percent: 87.0 }]);
      await createService({ findOne: mockFn, find: mockFn2 });
      await service.getPartners(activityCode).catch(err => {
        expect(err).toBe('sum not equal to 100, 200');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        where: { activityCode },
      });
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith({
        relations: ['activity', 'capayor'],
        where: { activity: { id: 1 }, endDate: MoreThan(moment().format('YYYY-MM-DD')) },
      });
    });

    it('should throw Error', async () => {
      const mockFn = jest.fn().mockResolvedValue({ id: 1 });
      const mockFn2 = jest.fn().mockRejectedValueOnce('Error');
      await createService({ findOne: mockFn, find: mockFn2 });
      await service.getPartners(activityCode).catch(err => {
        expect(err).toBe('Error');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({
        where: { activityCode },
      });
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith({
        relations: ['activity', 'capayor'],
        where: { activity: { id: 1 }, endDate: MoreThan(moment().format('YYYY-MM-DD')) },
      });
    });

    it('should throw "partner not found for trigram 1,partner not found for trigram 3"', async () => {
      const mockFn = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('partner 2')
        .mockResolvedValueOnce(null);
      const mockFn2 = jest.fn().mockResolvedValueOnce([
        { capayor: { partnerTrigram: 1 }, percent: 20 },
        { capayor: { partnerTrigram: 2 }, percent: 45 },
        { capayor: { partnerTrigram: 3 }, percent: 35 },
      ]);
      await createService({ findOne: mockFn, find: mockFn2 });
      await service.getPartners(activityCode).catch(err => {
        expect(err).toBe('partner not found for trigram 1,partner not found for trigram 3');
      });
      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(mockFn).toHaveBeenCalledWith({
        where: { activityCode },
      });
      expect(mockFn).toHaveBeenCalledWith({
        trigram: 1,
      });

      expect(mockFn).toHaveBeenCalledWith({
        trigram: 2,
      });
      expect(mockFn).toHaveBeenCalledWith({
        trigram: 3,
      });
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith({
        relations: ['activity', 'capayor'],
        where: { activity: { id: 1 }, endDate: MoreThan(moment().format('YYYY-MM-DD')) },
      });
    });

    it('should return partners', async () => {
      const mockFn = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce('partner 1')
        .mockResolvedValueOnce('partner 2')
        .mockResolvedValueOnce('partner 3');
      const mockFn2 = jest.fn().mockResolvedValueOnce([
        { capayor: { partnerTrigram: 1 }, percent: 20 },
        { capayor: { partnerTrigram: 2 }, percent: 45 },
        { capayor: { partnerTrigram: 3 }, percent: 35 },
      ]);
      await createService({ findOne: mockFn, find: mockFn2 });
      const res = await service.getPartners(activityCode);

      expect(res).toStrictEqual([
        { partner: 'partner 1', percent: 20 },
        { partner: 'partner 2', percent: 45 },
        { partner: 'partner 3', percent: 35 },
      ]);

      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(mockFn).toHaveBeenCalledWith({
        where: { activityCode },
      });
      expect(mockFn).toHaveBeenCalledWith({
        trigram: 1,
      });

      expect(mockFn).toHaveBeenCalledWith({
        trigram: 2,
      });
      expect(mockFn).toHaveBeenCalledWith({
        trigram: 3,
      });
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith({
        relations: ['activity', 'capayor'],
        where: { activity: { id: 1 }, endDate: MoreThan(moment().format('YYYY-MM-DD')) },
      });
    });
  });

  describe('import', () => {
    const filename = 'filename';
    let line: any = {},
      periodAppSettings = { period: { type: 'type' } };

    const init = async () => {
      line = {
        staff_type: 'EXTERNAL',
        portfolio: 'service',
        activity_plan: 'plan',
        Project_Name: 'Project_Name',
      };
      service.isValidParams = jest.fn().mockReturnValueOnce(true);
      service.isParseableLine = jest.fn().mockReturnValueOnce(true);
      service.isChargeableLine = jest.fn().mockReturnValueOnce(true);
      service.formatProjectCode = jest.fn().mockReturnValueOnce('ok');
      service.getPeriodAppSettings = jest.fn().mockResolvedValueOnce(periodAppSettings);
      service.getServiceByPortfolioName = jest.fn().mockReturnValueOnce('ok');
      service.getPlanCode = jest.fn().mockReturnValueOnce('ok');
      service.getSubtypologyByCode = jest.fn().mockResolvedValueOnce([{ code: 1 }, { code: 2 }]);
      service.getThirdparty = jest.fn().mockResolvedValueOnce('ok');
      service.findSubService = jest.fn().mockResolvedValueOnce('ok');
      service.findWorkloadBySubserviceThirdpartySubnature = jest.fn().mockResolvedValueOnce('ok');
      service.getGpcDatalakePartner = jest.fn().mockResolvedValueOnce('ok');
      service.getPartners = jest.fn().mockResolvedValueOnce([
        { partner: 'partner1', percent: 20 },
        { partner: 'partner2', percent: 80 },
      ]);
      service.getAllocations = jest.fn().mockResolvedValue('ok');
    };

    beforeEach(init);

    it('should throw Error: invalid line param', async () => {
      service.isValidParams = jest.fn().mockReturnValueOnce(false);
      await service.import(filename, line, true, true).catch(err => {
        expect(err.toString()).toBe('Error: invalid line param');
      });
    });

    it('should throw Error: line is not parseable', async () => {
      service.isParseableLine = jest.fn().mockReturnValueOnce(false);
      await service.import(filename, line, false, false, true).catch(err => {
        expect(err.toString()).toBe('Error: line is not parseable');
      });
    });

    it('should throw Error: Unkown subnature for line', async () => {
      service.isChargeableLine = jest.fn().mockReturnValueOnce(false);

      await service.import(filename, line, false, true, false).catch(err => {
        expect(err.toString()).toBe('Error: Unkown subnature for line');
      });
    });

    it('should throw subnature name not defined', async () => {
      line.staff_type = ' ';
      await service.import(filename, line).catch(err => {
        expect(err.toString()).toBe('subnature name not defined');
      });
    });

    it('should throw service name not defined', async () => {
      line.portfolio = ' ';

      await service.import(filename, line).catch(err => {
        expect(err.toString()).toBe('Service name not defined');
      });
    });

    it('should throw Plan not defined', async () => {
      line.activity_plan = ' ';
      await service.import(filename, line).catch(err => {
        expect(err.toString()).toBe('Plan not defined');
      });
    });

    it('should throw period not found', async () => {
      service.getPeriodAppSettings = jest.fn().mockResolvedValueOnce(null);

      await service.import(filename, line).catch(err => {
        expect(err.toString()).toBe('period not found');
      });
    });

    it('should throw Project code not defined', async () => {
      service.formatProjectCode = jest.fn().mockReturnValueOnce(' ');

      await service.import(filename, line).catch(err => {
        expect(err.toString()).toBe('Project code not defined');
      });
    });

    it('should throw Service not found service', async () => {
      service.getServiceByPortfolioName = jest.fn().mockResolvedValueOnce(null);

      await service.import(filename, line).catch(err => {
        expect(err).toBe('Service not found service');
      });
    });

    it('should throw Plan Code not found for plan plan', async () => {
      service.getPlanCode = jest.fn().mockReturnValueOnce(null);

      await service.import(filename, line).catch(err => {
        expect(err).toBe('Plan Code not found for plan plan');
      });
    });

    it('should throw subTypology not found', async () => {
      service.getSubtypologyByCode = jest.fn().mockResolvedValueOnce(null);

      await service.import(filename, line).catch(err => {
        expect(err).toBe('subTypology not found "ok"');
      });
    });

    it('should throw subTypology not found', async () => {
      service.getSubtypologyByCode = jest.fn().mockResolvedValueOnce([]);
      await service.import(filename, line).catch(err => {
        expect(err).toBe('subTypology not found "ok"');
      });
    });

    it('should throw thirdparty not found in line', async () => {
      service.getThirdparty = jest.fn().mockResolvedValueOnce(null);
      await service.import(filename, line).catch(err => {
        expect(err).toBe('thirdparty not found in line');
      });
    });

    it('should throw subservice owner "RESG/BSC" not found', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce(null);
      await createService({ findOne: mockFn });
      init();
      service.findSubService = jest.fn().mockResolvedValueOnce(null);
      await service.import(filename, line).catch(err => {
        expect(err).toBe('subservice owner "RESG/BSC" not found');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({ name: 'RESG/BSC' });
    });

    it('should throw Error', async () => {
      const mockFn = jest.fn().mockRejectedValueOnce('Error');
      await createService({ findOne: mockFn });
      init();
      service.findSubService = jest.fn().mockResolvedValueOnce(null);
      await service.import(filename, line).catch(err => {
        expect(err).toBe('Error');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({ name: 'RESG/BSC' });
    });

    it('should throw subservice could not be created', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce({ id: 'ownerid' });
      const mockFn2 = jest.fn().mockResolvedValueOnce(null);

      await createService({ findOne: mockFn, save: mockFn2 });
      init();
      service.findSubService = jest.fn().mockResolvedValueOnce(null);
      await service.import(filename, line).catch(err => {
        expect(err).toBe('subservice could not be created');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({ name: 'RESG/BSC' });
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith({
        code: 'ok',
        name: 'Project_Name',
        service: 'ok',
        subtypology: { code: 1 },
        thirdpPartyId: 'ownerid',
      });
    });

    it('should throw Error', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce({ id: 'ownerid' });
      const mockFn2 = jest.fn().mockRejectedValueOnce('Error');

      await createService({ findOne: mockFn, save: mockFn2 });
      init();
      service.findSubService = jest.fn().mockResolvedValueOnce(null);
      await service.import(filename, line).catch(err => {
        expect(err).toBe('Error');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({ name: 'RESG/BSC' });
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith({
        code: 'ok',
        name: 'Project_Name',
        service: 'ok',
        subtypology: { code: 1 },
        thirdpPartyId: 'ownerid',
      });
    });

    it('should throw subNature not found with name: "onshore"', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce({ id: 'ownerid' });
      const mockFn2 = jest.fn().mockResolvedValueOnce('ok');
      const mockFn3 = jest.fn().mockResolvedValueOnce(null);

      await createService({ findOne: mockFn, save: mockFn2, findByName: mockFn3 });
      init();
      service.findSubService = jest.fn().mockResolvedValueOnce(null);
      await service.import(filename, line).catch(err => {
        expect(err).toBe('subNature not found with name: "onshore"');
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith({ name: 'RESG/BSC' });
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledWith({
        code: 'ok',
        name: 'Project_Name',
        service: 'ok',
        subtypology: { code: 1 },
        thirdpPartyId: 'ownerid',
      });
      expect(mockFn3).toHaveBeenCalledTimes(1);
      expect(mockFn3).toHaveBeenCalledWith('onshore');
    });

    it('should throw Error', async () => {
      const mockFn = jest.fn().mockRejectedValueOnce('Error');

      await createService({ findByName: mockFn });
      init();
      await service.import(filename, line).catch(err => {
        expect(err).toBe('Error');
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('onshore');
    });

    it('should throw Partner not found in GPC database', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('subnature');

      await createService({ findByName: mockFn });
      init();
      service.getGpcDatalakePartner = jest.fn().mockResolvedValueOnce(null);
      await service.import(filename, line).catch(err => {
        expect(err).toBe('Partner not found in GPC database');
      });
    });

    it('should throw Error', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('subnature');

      await createService({ findByName: mockFn });
      init();
      service.getGpcDatalakePartner = jest.fn().mockResolvedValueOnce('partner');
      service.getAllocations = jest.fn().mockRejectedValueOnce('Error');
      await service.import(filename, line).catch(err => {
        expect(err).toBe('Error');
      });
      expect(service.getAllocations).toHaveBeenCalledTimes(1);
      expect(service.getAllocations).toHaveBeenCalledWith('ok', 'partner', { period: { type: 'type' } });
    });

    it('should throw Price not found for thirdparty undefined and subnature undefined', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('subnature');
      const mockFn2 = jest.fn().mockResolvedValueOnce(null);

      line.code_ca_payor = '3000377777';
      await createService({ findByName: mockFn, findOne: mockFn2, getCurrencyRateByCountryAndPeriod: mockFn2 });
      init();
      await service.import(filename, line).catch(err => {
        expect(err).toBe('Price not found for thirdparty undefined and subnature undefined');
      });
      expect(service.getAllocations).toHaveBeenCalledTimes(1);
      expect(service.getAllocations).toHaveBeenCalledWith('ok', 'ok', periodAppSettings);
    });

    it('should throw return undefined', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('subnature');
      const mockFn2 = jest
        .fn()
        .mockResolvedValueOnce('ok')
        .mockResolvedValueOnce('ok');
      const mockFn3 = jest.fn().mockResolvedValueOnce('ok');
      const mockFn4 = jest.fn().mockResolvedValueOnce('ok');
      const mockFn5 = jest.fn().mockResolvedValueOnce('ok');

      await createService({
        findByName: mockFn,
        findOne: mockFn2,
        getCurrencyRateByCountryAndPeriod: mockFn3,
        createAmountEntity: mockFn4,
        save: mockFn5,
      });
      init();
      service.findWorkloadBySubserviceThirdpartySubnature = jest.fn().mockResolvedValueOnce([]);
      service.createWorkload = jest.fn().mockResolvedValueOnce('ok');
      service.getAmountData = jest.fn().mockReturnValueOnce('ok');
      const res = await service.import(filename, line);
      expect(res).toBe(undefined);
    });

    it('should throw return undefined', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('subnature');
      const mockFn2 = jest.fn().mockResolvedValue('ok');
      const mockFn3 = jest.fn().mockResolvedValue({ value: 1 });
      const mockFn4 = jest.fn().mockResolvedValueOnce('ok');
      const mockFn5 = jest.fn().mockResolvedValueOnce('ok');

      await createService({
        findByName: mockFn,
        findOne: mockFn2,
        getCurrencyRateByCountryAndPeriod: mockFn3,
        createAmountEntity: mockFn4,
        save: mockFn5,
      });
      init();
      service.findWorkloadBySubserviceThirdpartySubnature = jest.fn().mockResolvedValueOnce(['ok']);
      service.createWorkload = jest.fn().mockResolvedValueOnce('ok');
      service.getAmountData = jest.fn().mockReturnValue({ amount: '10,3', unit: 'unit' });
      service.getAllocations = jest
        .fn()
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null)
        .mockReturnValue('allocation');
      service.getPeriodAppSettings = jest
        .fn()
        .mockReturnValueOnce({ period: { type: 'type' } })
        .mockReturnValueOnce(null)
        .mockReturnValue('prevAppsettings');
      line.code_ca_payor = '3000377777';
      periodAppSettings = { period: { type: 'type' } };
      const res = await service.import(filename, line).catch(err => {
        expect(err).toBe(undefined);
      });
      expect(res).toBe(undefined);
    });

    it('should throw return undefined', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('subnature');
      const mockFn2 = jest
        .fn()
        .mockResolvedValue('ok')
        .mockResolvedValue(null)
        .mockResolvedValue('ok')
        .mockResolvedValue('ok');
      const mockFn3 = jest.fn().mockResolvedValue({ value: 1 });
      const mockFn4 = jest.fn().mockResolvedValueOnce('ok');
      const mockFn5 = jest.fn().mockResolvedValueOnce('ok');

      await createService({
        findByName: mockFn,
        findOne: mockFn2,
        getCurrencyRateByCountryAndPeriod: mockFn3,
        createAmountEntity: mockFn4,
        save: mockFn5,
      });
      init();
      service.findWorkloadBySubserviceThirdpartySubnature = jest.fn().mockResolvedValueOnce([]);
      service.createWorkload = jest.fn().mockResolvedValueOnce('ok');
      service.getAmountData = jest.fn().mockReturnValue({ amount: '10', unit: 'unit' });
      service.getAllocations = jest
        .fn()
        .mockReturnValueOnce(null)
        .mockReturnValueOnce('allocation');
      service.getPeriodAppSettings = jest
        .fn()
        .mockReturnValueOnce({ period: { type: 'type' } })
        .mockReturnValueOnce(null)
        .mockReturnValue('prevAppsettings');
      const res = await service.import(filename, line).catch(err => {
        expect(err).toBe(undefined);
      });
      expect(res).toBe(undefined);
    });

    it('should throw return undefined', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('subnature');
      const mockFn2 = jest
        .fn()
        .mockResolvedValueOnce('ok')
        .mockResolvedValueOnce(false);
      const mockFn3 = jest.fn().mockResolvedValue({ value: 1 });
      const mockFn4 = jest.fn().mockResolvedValueOnce('ok');
      const mockFn5 = jest.fn().mockResolvedValueOnce('ok');

      await createService({
        findByName: mockFn,
        findOne: mockFn2,
        getCurrencyRateByCountryAndPeriod: mockFn3,
        createAmountEntity: mockFn4,
        save: mockFn5,
      });
      init();
      service.getGpcDatalakePartner = jest.fn().mockResolvedValueOnce('partner');
      service.findWorkloadBySubserviceThirdpartySubnature = jest.fn().mockResolvedValueOnce([1, 2]);
      service.getAllocations = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false);
      service.getPeriodAppSettings = jest.fn().mockResolvedValueOnce({ period: { type: 'type' } });
      service.createWorkload = jest.fn().mockResolvedValueOnce('ok');
      service.getAmountData = jest.fn().mockResolvedValueOnce('ok');
      const res = await service.import(filename, line).catch(err => {
        expect(err).toBe(undefined);
      });
      expect(res).toBe(undefined);
    });

    it('should throw return undefined', async () => {
      const mockFn = jest.fn().mockResolvedValueOnce('subnature');
      const mockFn2 = jest
        .fn()
        .mockResolvedValueOnce('ok')
        .mockResolvedValueOnce(false);
      const mockFn3 = jest.fn().mockResolvedValue({ value: 1 });
      const mockFn4 = jest.fn().mockResolvedValueOnce('ok');
      const mockFn5 = jest.fn().mockResolvedValueOnce('ok');

      await createService({
        findByName: mockFn,
        findOne: mockFn2,
        getCurrencyRateByCountryAndPeriod: mockFn3,
        createAmountEntity: mockFn4,
        save: mockFn5,
      });
      init();
      service.getGpcDatalakePartner = jest.fn().mockResolvedValueOnce('partner');
      service.findWorkloadBySubserviceThirdpartySubnature = jest.fn().mockResolvedValueOnce([1, 2]);
      service.getAllocations = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false);
      service.getPeriodAppSettings = async () => ({ period: { type: 'type' } });
      service.createWorkload = jest.fn().mockResolvedValueOnce('ok');
      service.getAmountData = jest.fn().mockResolvedValueOnce('ok');
      const res = await service.import(filename, line).catch(err => {
        expect(err).toBe(undefined);
      });
      expect(res).toBe(undefined);
    });
  });
});
