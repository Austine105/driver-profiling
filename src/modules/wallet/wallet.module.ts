import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletProvider } from './wallet.provider';

@Module({
  providers: [WalletService, ...WalletProvider],
  controllers: [WalletController],
  exports: [WalletService, ...WalletProvider]
})
export class WalletModule {}
