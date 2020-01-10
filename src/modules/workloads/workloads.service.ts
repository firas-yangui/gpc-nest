import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkloadRepository } from './workload.repository';
import { Request } from 'express';

// import { ThirdpartiesService } from './../thirdparties/thirdparties.service';
import { Thirdparty as ThirdpartyInterface, TotalAmountForThirdpartyRootData } from './../interfaces/common-interfaces';

@Injectable()
export class WorkloadsService {
  constructor(
    @InjectRepository(WorkloadRepository)
    private workloadRepository: WorkloadRepository, // private readonly thirdpartiesService: ThirdpartiesService,
  ) {}

  async getTotalAmountForThirdpartyRoot(req: Request, periodType: string, thirdpartyRootId: number): Promise<TotalAmountForThirdpartyRootData> {
    // const myThirdpartyRoot: ThirdpartyInterface = await this.thirdpartiesService.getThirdPartyById(thirdpartyRootId);
    // const thirdparties: ThirdpartyInterface[] = await this.thirdpartiesService.find();
    // this.thirdpartiesService.buildTree(thirdparties, myThirdpartyRoot);
    // const thirdpartyChilds = this.thirdpartiesService.getMyThirdPartiesChilds();

    return;
  }
}
