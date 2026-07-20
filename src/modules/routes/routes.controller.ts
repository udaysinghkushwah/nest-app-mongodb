import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { QueryRouteDto } from './dto/query-route.dto';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly svc: RoutesService) {}

  @Get() @ApiOperation({ summary: 'List routes filtered by src/dst airport, airline, stops' })
  findAll(@Query() q: QueryRouteDto) { return this.svc.findAll(q); }

  @Get('stats/airlines') @ApiOperation({ summary: 'Top 15 airlines by route count' })
  topAirlines() { return this.svc.topAirlines(); }

  @Get('stats/destinations') @ApiOperation({ summary: 'Top 15 destinations by route count' })
  topDestinations() { return this.svc.topDestinations(); }

  @Get(':id') @ApiOperation({ summary: 'Get a route by ID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }
}
