import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { WalletModel as Wallet } from './wallet.model';
import { GetUser } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@ApiTags('Wallet (Contribution Account)')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get('balance')
  @ApiResponse({ type: Wallet })
  async findMyWallet(
    @GetUser('id') userId: number,

  ) {

    const balance = await (await this.walletService.findOne(userId)).balance;
    return {
      balance
    };
  }
}
