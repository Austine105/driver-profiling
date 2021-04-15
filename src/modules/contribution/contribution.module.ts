import { Module } from '@nestjs/common';
import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';
import { ContributionProvider } from './contribution.provider';
import { BullModule } from '@nestjs/bull';
import { WalletModule } from '../wallet/wallet.module';
import { ContributionProcessor } from './queue/contribution.processor';
import { DriverModule } from '../driver/driver.module';
import { AssociationModule } from '../association/association.module';

@Module({
  imports: [
    WalletModule,
    DriverModule,
    AssociationModule,
    BullModule.registerQueue({
      name: 'contributions',
    }),
  ],
  providers: [ContributionService, ...ContributionProvider, ContributionProcessor],
  controllers: [ContributionController],
  exports: [ContributionService]
})
export class ContributionModule {}
