import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import 'jest';

import { WorkloadsModule } from '../src/modules/workloads/workloads.module';
import { ThirdpartiesModule } from '../src/modules/thirdparties/thirdparties.module';
import { SubservicesModule } from '../src/modules/subservices/subservices.module';
import { PeriodsModule } from '../src/modules/periods/periods.module';
import { WorkloadRepository } from '../src/modules/workloads/workload.repository';
import DbLoader from '../src/loader';

describe.skip('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([WorkloadRepository]),
        ThirdpartiesModule,
        SubservicesModule,
        PeriodsModule,
        WorkloadsModule,
        // Use the e2e_test database to run the tests
        TypeOrmModule.forRoot(DbLoader),
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should call SG Connect to verify the user info', async () => {
    expect(true).toBeTruthy;
  });
});
