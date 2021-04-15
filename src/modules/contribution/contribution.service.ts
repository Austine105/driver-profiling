import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions, Op, literal } from 'sequelize';
import { NewContributionDto } from './dto/new-contribution.dto';
import { ContributionModel as Contribution } from './contribution.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { CONTRIBUTION_REPOSITORY, CONTRIBUTION_TYPE, ERROR_MESSAGES } from './constants';
import { WalletService } from '../wallet/wallet.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DateTime } from 'luxon';
import { genRandom, getNextDaysDate } from 'src/common/utils/util';
import { AssociationService } from '../association/association.service';
import { Readable } from 'stream';
import { DriverService } from '../driver/driver.service';


@Injectable()
export class ContributionService {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY) private readonly contributionRepo: typeof Contribution,
    @InjectQueue('contributions') private readonly contributionQueue: Queue,
    private readonly driverService: DriverService,
    private readonly walletService: WalletService,
  ) { }


  async create(newContribution: NewContributionDto): Promise<Boolean> {

    // retrive daily_contribution_amount
    const driver = await this.driverService.findById(newContribution.driver_id);
    newContribution.amount = driver.daily_contribution_amount;

    // prevent duplicate transactions made by error
    // if last contribution in db is same amount and sent 1 minute ago
    const existingContribution = await this.contributionRepo.findOne({
      where: {
        amount: newContribution.amount,
        driver_id: newContribution.driver_id,
        created_at: {
          [Op.gte]: literal("NOW() - (INTERVAL '1 MINUTE')"),
        }
      },
    });

    if (existingContribution)
      throw new BadRequestException(ERROR_MESSAGES.DuplicateContribution);

    // send contribution to job queue;
    this.contributionQueue.add('new_contribution', newContribution);

    return true;
  }

  async capitalizeWeeklyInterest(date: string): Promise<Boolean> {
    const query: any = {
      where: {
        next_interest_capitalization_date: date,
      }
    };

    try {
      const contributionStream = await this.getStream(query);

      contributionStream.on('data', async (contribution: Contribution) => {

        await this.contributionRepo.sequelize.transaction(async t => {
          const transactionHost = { transaction: t };

          contribution.amount = this.calculateInterest(contribution.amount);

          // update driver next_interest_date
          const driver = await this.driverService.findById(contribution.driver_id);
          driver.next_interest_date = DateTime.fromJSDate(new Date()).toFormat('yyyy-MM-dd');

          // commit changes to database
          await contribution.save(transactionHost);
          await driver.save(transactionHost);
        });
      });
    }
    catch (err) {
      throw err;
    }

    return true;
  }

  async findAll(params): Promise<FindAllQueryInterface<Contribution>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at', 'updated_at']
      },
      // include: [WalletModel],
      where: {
        ...params.where
      }
    };

    const contributions = await this.contributionRepo.findAndCountAll(query);
    const paging = pagingParser(query, contributions.count, contributions.rows.length);

    return {
      paging,
      data: contributions.rows
    };
  }

  async findOne(id: number): Promise<Contribution> {
    const contribution = await this.contributionRepo.findOne({
      where: {
        id
      },
      // include: [{
      //   model: WalletModel,
      //   attributes: {
      //     exclude: ['deleted_at', 'updated_at']
      //   },
      // }],
      attributes: { exclude: ['deleted_at'] }
    });
    if (!contribution)
      throw new BadRequestException(ERROR_MESSAGES.ContributionNotFound);

    return contribution;
  }

  private async getCount(params): Promise<number> {
    const count = await this.contributionRepo.count({
      where: {
        ...params.where
      }
    });
    return count;
  }

  private getStream(params) {
    let maxPage;
    const query: any = {
      page: 0,
      limit: 100,
      order: params.order,
      attributes: {
        include: params.include || null,
        exclude: ['Meta', 'UpdatedAt', 'DeletedAt']
      },
      where: {
        ...params.where
      }
    }

    try {
      const stream = new Readable({
        objectMode: true,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        read() { }
      });

      const readNextChunk = () => {
        query.page++;
        query.skip = (query.page - 1) * query.limit;

        if (query.page > maxPage) {
          stream.push(null);  // close stream
          return;
        }
        return this.contributionRepo.findAll(query)
          .each((item) => {
            stream.push(item.toJSON())
          })
          .then(() => readNextChunk());
      }

      return this.getCount(query)
        .then((count) => {
          maxPage = (count < query.limit) ? 1 : Math.ceil(count / query.limit);
          return stream;
        })
        .finally(() => readNextChunk())
    }
    catch (err) {
      console.log('err: ' + err);
    }
  }

  // calculate weekly 2.17% Interest
  private calculateInterest(amount) {
    return amount + (amount * 0.0217);
  }

  // !!!
  // this is used for JOB processing and shouldn't be called by controller
  async processNewContributionJob(newContribution: NewContributionDto): Promise<Boolean> {

    newContribution.reference = genRandom() + new Date().getTime().toString();

    await this.contributionRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      await this.walletService.credit(newContribution.driver_id, newContribution.amount, transactionHost);
      await this.contributionRepo.create(newContribution, transactionHost);
    });
    return true;
  }

  async processWeeklyInterestJob(newContribution: NewContributionDto): Promise<Boolean> {

    newContribution.reference = genRandom() + new Date().getTime().toString();
    newContribution.contribution_type = CONTRIBUTION_TYPE.WeeklyInterest;

    const driver = await this.driverService.findById(newContribution.driver_id);
    driver.next_interest_date = getNextDaysDate(7);

    await this.contributionRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      await this.walletService.credit(newContribution.driver_id, newContribution.amount, transactionHost);
      await this.contributionRepo.create(newContribution, transactionHost);
      await driver.save(transactionHost);
    });
    return true;
  }
}
