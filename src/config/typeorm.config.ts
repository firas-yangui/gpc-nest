import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || process.env.TYPEORM_HOST,
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.DATABASE_USER || process.env.TYPEORM_USERNAME,
  password: process.env.DATABASE_PASSWORD || process.env.TYPEORM_PASSWORD,
  database: process.env.DATABASE_DB || process.env.TYPEORM_DATABASE,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false,
};

export default typeOrmConfig;
