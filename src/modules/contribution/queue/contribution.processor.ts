import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ContributionService } from '../contribution.service';

@Processor('contributions')
export class ContributionProcessor {
  constructor(
    private readonly contributionService: ContributionService
    ) { }

  @Process('new_contribution')
  async processContribution(contributionJob: Job) {

    await this.contributionService.processNewContributionJob(contributionJob.data);
  }
}
