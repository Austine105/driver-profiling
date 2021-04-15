import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AllExceptionsFilter } from './common/exception/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { ContributionModule } from './modules/contribution/contribution.module';
import { DriverModule } from './modules/driver/driver.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { AssociationModule } from './modules/association/association.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AssociationModule,
    DatabaseModule,
    AuthModule,
    DriverModule,
    ContributionModule,
    WalletModule
  ],
  providers: [AllExceptionsFilter],
  controllers: [AppController]
})
export class AppModule { }
