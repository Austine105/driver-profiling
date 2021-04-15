import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverProvider } from './driver.provider';
import { DriverController } from './driver.controller';
import { AssociationModule } from '../association/association.module';
import { WalletModule } from '../wallet/wallet.module';


@Module({
  imports: [AssociationModule, WalletModule],
  providers: [DriverService, ...DriverProvider],
  controllers: [DriverController],
  exports: [DriverService]
})
export class DriverModule {}
