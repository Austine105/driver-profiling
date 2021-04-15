import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { WalletModel as Wallet } from './wallet.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { WALLET_REPOSITORY, ERROR_MESSAGES } from './constants';
import { NewWalletDto } from './dto/new-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @Inject(WALLET_REPOSITORY) private readonly walletRepo: typeof Wallet,
  ) { }

  async create(newWallet: NewWalletDto, transactionHost: any): Promise<Wallet> {
    return this.walletRepo.create(newWallet, transactionHost);
  }

  async findAll(params): Promise<FindAllQueryInterface<Wallet>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at']
      },
      where: {
        ...params.where
      }
    };

    const wallets = await this.walletRepo.findAndCountAll(query);
    const paging = pagingParser(query, wallets.count, wallets.rows.length);

    return {
      paging,
      data: wallets.rows
    };
  }

  async findOne(driver_id: number): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({
      where: {
        driver_id
      },
      attributes: {
        exclude: ['deleted_at', 'created_at']
      },
    });
    if (!wallet)
      throw new BadRequestException(ERROR_MESSAGES.WalletNotFound);

    return wallet;
  }

  // !!!
  // The following methods should only be called from Job Queue Processors

  async credit(driver_id: number, amount: number, transactionHost: any): Promise<Wallet> {
    const wallet = await this.findOne(driver_id);
    wallet.balance = wallet.balance + amount;

    return wallet.save(transactionHost);
  }

  async debit(driver_id: number, amount: number, transactionHost): Promise<Wallet> {
    const wallet = await this.findOne(driver_id);
    if (wallet.balance < amount)
      throw new BadRequestException(ERROR_MESSAGES.InsufficientWallet);

    wallet.balance = wallet.balance - amount;
    return wallet.save(transactionHost);
  }
}
