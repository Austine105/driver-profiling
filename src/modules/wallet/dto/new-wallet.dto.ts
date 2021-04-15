import { IsPositive } from 'class-validator';

export class NewWalletDto {

  @IsPositive()
  driver_id: number
}
