import { ForbiddenException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not } from 'typeorm';
import { TransactionRepository } from './transaction.repository';
import { ThirdpartiesService } from '../thirdparties/thirdparties.service';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { UserService } from '../user/user.service';

export enum TransactionStatus {
  INPROGRESS = 'inprogress',
  PROCESSED = 'processed',
  REJECTED = 'rejected',
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository) private transactionRepository: TransactionRepository,
    private userService: UserService,
    private thirdpartiesService: ThirdpartiesService,
  ) {}

  public async getAll() {
    return await this.transactionRepository.find({
      relations: ['subService', 'sender', 'receiver', 'targetThirdParty', 'transactionWorkloads', 'transactionWorkloads.workload'],
    });
  }

  public async getAllWithUserId(userId: number, thirdpartyRootId: number) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user.ismanager) {
        throw new ForbiddenException(HttpStatus.UNAUTHORIZED, 'User is not a manager');
      }

      const myThirdpartyRoot = await this.thirdpartiesService.getThirdPartyById(thirdpartyRootId);
      const allThirdparties: Thirdparty[] = await this.thirdpartiesService.find({});
      this.thirdpartiesService.buildTree(allThirdparties, myThirdpartyRoot);
      const thirdparties = this.thirdpartiesService.getMyThirdPartiesChilds();

      return await this.transactionRepository.find({
        relations: ['subService', 'sender', 'receiver', 'targetThirdParty', 'transactionWorkloads', 'transactionWorkloads.workload'],
        where: {
          status: TransactionStatus.INPROGRESS,
          sender: {
            id: Not(userId),
          },
          targetThirdParty: {
            id: In(thirdparties),
          },
        },
      });
    } catch (error) {
      Logger.error(error, error, 'TransactionService');
      return [];
    }
  }

  public async getLatestTransactions(count = 6) {
    return await this.transactionRepository.find({
      order: {
        id: 'DESC',
      },
      take: count,
    });
  }
}
