import { Module } from '@nestjs/common';
import { AssociationController } from './association.controller';
import { AssociationService } from './association.service';
import { AssociationProvider } from './association.provider';

@Module({
  imports: [],
  providers: [AssociationService, ...AssociationProvider],
  controllers: [AssociationController],
  exports: [AssociationService]
})
export class AssociationModule {}
