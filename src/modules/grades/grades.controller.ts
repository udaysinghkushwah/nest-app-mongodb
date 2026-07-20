import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GradesService } from './grades.service';
import { QueryGradeDto } from './dto/query-grade.dto';

@ApiTags('grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly svc: GradesService) {}

  @Get() @ApiOperation({ summary: 'List grades with pagination, student_id/class_id filters' })
  findAll(@Query() q: QueryGradeDto) { return this.svc.findAll(q); }

  @Get('stats/class/:class_id') @ApiOperation({ summary: 'Average score by type for a class' })
  statsByClass(@Param('class_id') class_id: string) { return this.svc.statsByClass(+class_id); }

  @Get(':id') @ApiOperation({ summary: 'Get a grade record by ID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }
}
