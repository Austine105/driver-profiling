import { Module } from '@nestjs/common';
import { ContributionModule } from 'src/modules/contribution/contribution.module';
import { CronService } from './crons';

@Module({
  imports: [ContributionModule],
  providers: [
    CronService,
  ]
})
export class CronModule {}
