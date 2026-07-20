import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { QueryTripDto } from './dto/query-trip.dto';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly svc: TripsService) {}

  @Get() @ApiOperation({ summary: 'List trips with usertype and duration range filters' })
  findAll(@Query() q: QueryTripDto) { return this.svc.findAll(q); }

  @Get('stats/duration') @ApiOperation({ summary: 'Avg/min/max trip duration stats' })
  durationStats() { return this.svc.durationStats(); }

  @Get('stats/usertype') @ApiOperation({ summary: 'Trip count and avg duration by user type' })
  usertypeStats() { return this.svc.usertypeStats(); }

  @Get(':id') @ApiOperation({ summary: 'Get a trip by ID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }
}
