import { BelongsTo, Column, ForeignKey, Index, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { DriverModel } from '../driver/driver.model';
import { WalletModel } from '../wallet/wallet.model';

@Table({
  tableName: 'contributions',
  timestamps: true,
  paranoid: true
})

export class ContributionModel extends BaseModel {

  @Column({
    allowNull: false
  })
  amount: number

  @Index
  @ForeignKey(() => WalletModel)
  @Column({
    allowNull: false
  })
  driver_id: number

  @Index
  @Column({
    allowNull: false,
    unique: true
  })
  reference: string

  @Column({
    allowNull: false,
  })
  contribution_type: string

  @BelongsTo(() => DriverModel, 'driver_id')
  driver: DriverModel
}
