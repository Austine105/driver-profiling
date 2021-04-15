import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/models/base.model';

@Table({
  tableName: 'associations',
  timestamps: true,
  paranoid: true
})

export class AssociationModel extends BaseModel {

  @Column({
    allowNull: false
  })
  name: string

  @Column({
    allowNull: false
  })
  description: string

}
