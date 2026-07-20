import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { QueryCompanyDto } from './dto/query-company.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly svc: CompaniesService) {}

  @Get() @ApiOperation({ summary: 'List companies with pagination/search/filter' })
  findAll(@Query() q: QueryCompanyDto) { return this.svc.findAll(q); }

  @Get('categories') @ApiOperation({ summary: 'List all distinct company categories' })
  categories() { return this.svc.categories(); }

  @Get(':id') @ApiOperation({ summary: 'Get a company by ID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }
}
