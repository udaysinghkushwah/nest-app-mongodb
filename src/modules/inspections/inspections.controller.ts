import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InspectionsService } from './inspections.service';
import { QueryInspectionDto } from './dto/query-inspection.dto';

@ApiTags('inspections')
@Controller('inspections')
export class InspectionsController {
  constructor(private readonly svc: InspectionsService) {}

  @Get() @ApiOperation({ summary: 'List inspections with search/result/sector/city filters' })
  findAll(@Query() q: QueryInspectionDto) { return this.svc.findAll(q); }

  @Get('stats/results') @ApiOperation({ summary: 'Count inspections grouped by result' })
  resultStats() { return this.svc.resultStats(); }

  @Get('stats/sectors') @ApiOperation({ summary: 'Top 20 sectors by inspection count' })
  sectorStats() { return this.svc.sectorStats(); }

  @Get(':id') @ApiOperation({ summary: 'Get an inspection by ID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }
}
