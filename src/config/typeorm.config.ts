import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgresql',
  port: 5432,
  username: 'gpc',
  password: '',
  database: 'gpc',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
