import 'jest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import { AppModule } from '../src/app.module';
import { SgConnectTokenVerificationService, SgConnectCache } from '@societe-generale/nestjs-sg-connect';
import { TOKEN, TOKEN_INFO, USER_INFO, SG_CONNECT_OPTIONS, SG_CONNECT_URL } from './test-constants';
import { EmployeesService } from '../src/modules/employees/employees.service';

describe('AppModule (e2e)', () => {
  let app: INestApplication;
  const empService = { getHello: () => 'Hello world !' };
  let sgService: SgConnectTokenVerificationService;

  beforeEach(() => {
    sgService = new SgConnectTokenVerificationService(SG_CONNECT_OPTIONS, new SgConnectCache());
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmployeesService)
      .useValue(empService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should call SG Connect to verify the token info', async () => {
    // Simulate the SG Connect response for /tokeninfo endpoint
    const callToTokenInfoEndpoint = nock(SG_CONNECT_URL)
      .get('/oauth2/tokeninfo')
      .reply(200, TOKEN_INFO);

    // Simulate the SG Connect response for /userinfo endpoint
    nock(SG_CONNECT_URL)
      .get('/oauth2/userinfo')
      .reply(200, USER_INFO);

    await sgService.verifySGConnectV2Token(TOKEN);
    expect(callToTokenInfoEndpoint.isDone()).toBeTruthy();
  });

  it('should call SG Connect to verify the user info', async () => {
    // Simulate the SG Connect response for /tokeninfo endpoint
    nock(SG_CONNECT_URL)
      .get('/oauth2/tokeninfo')
      .reply(200, TOKEN_INFO);

    // Simulate the SG Connect response for /userinfo endpoint
    const callToUserInfoEndpoint = nock(SG_CONNECT_URL)
      .get('/oauth2/userinfo')
      .reply(200, USER_INFO);

    await sgService.verifySGConnectV2Token(TOKEN);
    expect(callToUserInfoEndpoint.isDone()).toBeTruthy();
  });

  it('should return null when the token is invalid', async () => {
    // Simulate a SG Connect response when a token is invalid or expired.
    nock(SG_CONNECT_URL)
      .get('/oauth2/tokeninfo')
      .reply(400, {
        error_description: 'The access token provided is expired, revoked, malformed, or invalid for other reasons.',
        error: 'invalid_token',
      });

    const result = await sgService.verifySGConnectV2Token(TOKEN);
    expect(result).toBeNull();
  });

  it('should not call SG Connect to verify the user info if the grant_type is not "token"', async () => {
    nock(SG_CONNECT_URL)
      .get('/oauth2/tokeninfo')
      .reply(200, {
        ...TOKEN_INFO,
        grant_type: 'client_credentials',
      });

    const callToUserInfoEndpoint = nock(SG_CONNECT_URL)
      .get('/oauth2/userinfo')
      .reply(200, USER_INFO);

    await sgService.verifySGConnectV2Token(TOKEN);
    expect(callToUserInfoEndpoint.isDone()).toBeFalsy();
  });

  /*it(`/GET employees`, () => {
    return request(app.getHttpServer())
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${TOKEN}`)
      .get('/employees')
      .expect(200)
      .expect({
        data: empService.getHello(),
      });
  });*/
  afterAll(async () => {
    await app.close();
  });
});
