import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { ContributionService } from 'src/modules/contribution/contribution.service';



@Injectable()
export class CronService {

  private static dailyCronSchedule = CronExpression.EVERY_DAY_AT_MIDNIGHT;
  constructor(
    private readonly contributionService: ContributionService
  ) { }

  // this runs daily at midnight
  // because all drivers on the platform do not start contribution on the same day of the week
  @Cron(CronService.dailyCronSchedule)
  async dailyCron() {
    console.log('cron started..');
    
    const date = DateTime.fromJSDate(new Date()).toFormat('yyyy-MM-dd');
    await this.contributionService.capitalizeWeeklyInterest(date);

    console.log('cron ended..');
  }
}
