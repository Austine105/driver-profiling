import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';
import { CONTRIBUTION_TYPE } from '../constants';

export class ContributionQueryFiltersDto extends BaseQueryFiltersDto {
  @IsOptional()
  driver_id?: number;

  @IsOptional()
  reference?: number;

  @IsOptional()
  @IsEnum(CONTRIBUTION_TYPE)
  contribution_type?: string = CONTRIBUTION_TYPE.Contribution;
}
