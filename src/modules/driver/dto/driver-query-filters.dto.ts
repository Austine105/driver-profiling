import { IsEmail, IsOptional } from 'class-validator';
import { BaseQueryFiltersDto } from 'src/common/dto/base-query-filters.dto';

export class DriverQueryFiltersDto extends BaseQueryFiltersDto {

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  association_id?: number;
}
