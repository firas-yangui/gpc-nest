import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IrtApplicationRepository } from './irtapplication.repository';

@Injectable()
export class IrtApplicationService {
  constructor(
    @InjectRepository(IrtApplicationRepository)
    private irtApplicationRepository: IrtApplicationRepository,
  ) {}
}
