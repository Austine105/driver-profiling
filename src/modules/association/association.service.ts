import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { NewAssociationDto } from './dto/new-association.dto';
import { AssociationModel as Association } from './association.model';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { pagingParser } from 'src/common/utils/paging-parser';
import { ASSOCIATION_REPOSITORY, ERROR_MESSAGES } from './constants';


@Injectable()
export class AssociationService {
  constructor(
    @Inject(ASSOCIATION_REPOSITORY) private readonly associationRepo: typeof Association,
  ) { }

  async create(newAssociation: NewAssociationDto): Promise<Association> {

    return this.associationRepo.create(newAssociation);
  }

  async findAll(params): Promise<FindAllQueryInterface<Association>> {
    const query: FindOptions = {
      limit: params.limit,
      offset: params.skip,
      order: params.order,
      attributes: {
        exclude: ['deleted_at', 'updated_at']
      },
      where: {
        ...params.where
      }
    };

    const associations = await this.associationRepo.findAndCountAll(query);
    const paging = pagingParser(query, associations.count, associations.rows.length);

    return {
      paging,
      data: associations.rows
    };
  }

  async findById(id: number): Promise<Association> {
    const association = await this.associationRepo.findByPk( id, {
      attributes: { exclude: ['deleted_at'] }
    });
    if (!association)
      throw new BadRequestException(ERROR_MESSAGES.AssociationNotFound);

    return association;
  }
}
