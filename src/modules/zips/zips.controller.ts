import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ZipsService } from './zips.service';
import { QueryZipDto } from './dto/query-zip.dto';

@ApiTags('zips')
@Controller('zips')
export class ZipsController {
  constructor(private readonly svc: ZipsService) {}

  @Get() @ApiOperation({ summary: 'List zip codes with state/city/population filters' })
  findAll(@Query() q: QueryZipDto) { return this.svc.findAll(q); }

  @Get('stats/states') @ApiOperation({ summary: 'Total population and city count per state' })
  stateStats() { return this.svc.stateStats(); }

  @Get('stats/top-cities') @ApiOperation({ summary: 'Top 10 cities by population' })
  topCities() { return this.svc.topCities(); }

  @Get(':id') @ApiOperation({ summary: 'Get a zip record by ID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }
}
