import { SgConnectOptions, SgConnectTokenInfo, SgConnectUserInfo } from '@societe-generale/nestjs-sg-connect';

export const SG_CONNECT_URL = 'https://sso.sgmarkets.com/sgconnect';

export const SG_CONNECT_OPTIONS: SgConnectOptions = {
  sgConnectUrl: SG_CONNECT_URL,
};

export const TOKEN = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
export const CLIENT_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

export const TOKEN_INFO: SgConnectTokenInfo = {
  mail: 'john.doe@sgcib.com',
  auth_level: 'L2',
  openid: '',
  profile: '',
  origin_network: 'LAN',
  token_type: 'Bearer',
  client_id: CLIENT_ID,
  access_token: TOKEN,
  grant_type: 'token',
  scope: [
    'sgx@@origin_network@@LAN',
    'sgx@@auth_level@@L2',
    'mail',
    'openid',
    'profile',
    'scope.foo',
  ],
  realm: '/',
  expires_in: 576,
};

export const USER_INFO: SgConnectUserInfo = {
  sub: 'john.doe@sgcib.com',
  zoneinfo: '',
  postal_country: '',
  mail: 'john.doe@sgcib.com',
  igg: '1000000000',
  last_name: 'DOE',
  login_ad: 'johndoe',
  company_bdr_name: '',
  given_name: '',
  locale: '',
  contact_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  sgconnect_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  user_authorization: [],
  rc_local_sigle: 'FOO/BAR',
  sesame_id: 'john.doe',
  user_bdr_id: '',
  company_bdr_level: '',
  name: 'John DOE',
  is_sg_group_user: 'true',
  family_name: 'DOE',
  first_name: 'John',
  company_bdr_id: '',
  preferred_language: 'en',
  origin_network: 'LAN',
  auth_level: 'L2',
};
