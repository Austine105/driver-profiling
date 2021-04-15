import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DriverModel as Driver } from './driver.model';
import { DRIVER_REPOSITORY, ERROR_MESSAGES } from './constants';
import { NewDriverDto } from './dto/new-driver.dto';
import { pagingParser } from 'src/common/utils/paging-parser';
import { FindOptions, Op } from 'sequelize';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { AssociationService } from '../association/association.service';
import { AssociationModel } from '../association/association.model';
import { WalletService } from '../wallet/wallet.service';
import { getNextDaysDate } from 'src/common/utils/util';
const bcrypt = require('bcrypt');


@Injectable()
export class DriverService {
  constructor(
    @Inject(DRIVER_REPOSITORY) private readonly driverRepo: typeof Driver,
    private readonly associationService: AssociationService,
    private readonly walletService: WalletService
  ) { }

  async create(newDriver: NewDriverDto): Promise<Driver> {

    let createdDriver;

    if (!await this.associationService.findById(newDriver.association_id))
      throw new BadRequestException(ERROR_MESSAGES.AssociationNotFound);

    newDriver.password = await bcrypt.hash(newDriver.password, 10);
    // next interest capitalization date should be 1 week from now
    newDriver.next_interest_date = getNextDaysDate(7);

    await this.driverRepo.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };

      createdDriver = await this.driverRepo.create(newDriver, transactionHost);
      await this.walletService.create({ driver_id: createdDriver.id }, transactionHost);
    });
    return createdDriver;
  }

  async findAll(params): Promise<FindAllQueryInterface<Driver>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at', 'updated_at', 'password']
      },
      where: {
        ...params.where
      }
    };

    const drivers = await this.driverRepo.findAndCountAll(query);
    const paging = pagingParser(query, drivers.count, drivers.rows.length);

    return {
      paging,
      data: drivers.rows
    };
  }

  async findById(id: number): Promise<Driver | null> {
    const driver = await this.driverRepo.findByPk(id,
      {
        attributes: { exclude: ['deleted_at', 'password'] },
        include: [
          {
            model: AssociationModel,
            attributes: {
              exclude: ['created_at', 'deleted_at', 'updated_at']
            },
          },
        ],
      });

    return driver;
  }

  async findByUsername(username: string): Promise<Driver | null> {
    const driver = await this.driverRepo.findOne({
      // where: { email },
      where: {
        [Op.or]: [
          {
            email: {
              [Op.eq]: username
            }
          },
          {
            phone: {
              [Op.eq]: username
            }
          },
        ]
      },
      attributes: { exclude: ['deleted_at'] },
    });

    return driver;
  }
}

