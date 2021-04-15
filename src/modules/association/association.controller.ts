import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator/user.decorator';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { AssociationService } from './association.service';
import { AssociationModel as Association } from './association.model';
import { AssociationQueryFiltersDto } from './dto/association-query-filters.dto';
import { NewAssociationDto } from './dto/new-association.dto';


@ApiTags('Association')
@Controller('association')
export class AssociationController {
  constructor(private readonly associationService: AssociationService) { }

  @Post()
  async create(
    @Body(new ValidationPipe()) newAssociation: NewAssociationDto,
  ) {
    return this.associationService.create(newAssociation);
  }

  @Get()
  @ApiResponse({ type: Association })
  async findAll(@Query(new ValidationPipe({ transform: true })) query: AssociationQueryFiltersDto,
    ) {

    query = parseQueryObj(query, []);

    return this.associationService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number
  ) {
    return this.associationService.findById(id);
  }

}
