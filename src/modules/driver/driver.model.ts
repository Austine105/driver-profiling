import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';
import { AssociationModel } from '../association/association.model';


@Table({
  tableName: 'drivers',
  timestamps: true,
  paranoid: true
})

export class DriverModel extends BaseModel {
  @Column({
    allowNull: false
  })
  firstname: string;

  @Column({
    allowNull: false
  })
  lastname: string;

  @Column({
    allowNull: false,
    unique: true
  })
  phone: string;

  @Column({
    allowNull: false,
    unique: true
  })
  email: string;

  @Column({
    allowNull: false,
  })
  association_id: number;

  @Column({
    allowNull: false,
  })
  password: string;

  @Column({
    allowNull: false,
  })
  daily_contribution_amount: number;

  @Column({
    allowNull: false,
  })
  next_interest_date: string;

  // associations
  @BelongsTo(() => AssociationModel, 'association_id')
  association: AssociationModel;
}
