import { ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPositive, IsString } from 'class-validator';


export class NewDriverDto {

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsPositive()
  association_id: number

  @IsPositive()
  daily_contribution_amount: number

  @ApiHideProperty()
  @IsOptional()
  next_interest_date: string
}
