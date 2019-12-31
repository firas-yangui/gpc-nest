import { RegisterUsersMiddleware } from './register-users.middleware';

describe('RegisterUsersMiddleware', () => {
  it('should be defined', () => {
    expect(new RegisterUsersMiddleware()).toBeDefined();
  });
});
