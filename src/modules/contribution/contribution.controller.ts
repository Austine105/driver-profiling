import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { ContributionService } from './contribution.service';
import { ContributionModel as Contribution } from './contribution.model';
import { ContributionQueryFiltersDto } from './dto/contribution-query-filters.dto';
import { NewContributionDto } from './dto/new-contribution.dto';
import { GetUser } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@ApiTags('Contribution')
@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) { }

  @Post()
  async createContribution(
    @Body(new ValidationPipe({ transform: true })) newContribution: NewContributionDto,
    @GetUser('id') driverId: number
    ) {
      newContribution.driver_id = driverId;
    return this.contributionService.create(newContribution);
  }

  @Get()
  @ApiResponse({ type: Contribution })
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: ContributionQueryFiltersDto,
    @GetUser('id') driverId: number,
    ) {

    const queryObj = parseQueryObj(query, []);
    queryObj.where.driver_id = driverId;

    return this.contributionService.findAll(queryObj);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) contributionId: number,
  ) {
    return this.contributionService.findOne(contributionId);
  }
}
