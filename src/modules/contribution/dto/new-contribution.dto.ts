import { ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { CONTRIBUTION_TYPE } from '../constants';

@ApiTags('Contribution')
export class NewContributionDto {

  @ApiHideProperty()
  @IsOptional()
  driver_id: number

  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  amount: number

  @ApiHideProperty()
  @IsOptional()
  reference: string

  @ApiHideProperty()
  @IsEnum(CONTRIBUTION_TYPE)
  contribution_type?: string = CONTRIBUTION_TYPE.Contribution;
}
