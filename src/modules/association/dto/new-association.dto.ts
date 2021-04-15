import { IsPositive, MinLength } from 'class-validator';


export class NewAssociationDto {

  @MinLength(2)
  name: string

  @MinLength(2)
  description: string
}
