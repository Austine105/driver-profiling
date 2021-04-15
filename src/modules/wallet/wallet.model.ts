import { BelongsTo, Column, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { ContributionModel } from '../contribution/contribution.model';
import { DriverModel } from '../driver/driver.model';

@Table({
  tableName: 'wallets',
  timestamps: true,
  paranoid: true
})

export class WalletModel extends BaseModel {

  @Column({
    allowNull: false,
    defaultValue: 0
  })
  balance: number

  @Column({
    allowNull: false
  })
  driver_id: number

  // associations
  @BelongsTo(() => DriverModel, 'driver_id')
  driver: DriverModel;

  @HasMany(() => ContributionModel, 'wallet_id')
  contributions: ContributionModel;
}
