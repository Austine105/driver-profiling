import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class AssociationQueryFiltersDto extends BaseQueryFiltersDto {
  @ApiHideProperty()
  @IsOptional()
  created_by?: number;
}
