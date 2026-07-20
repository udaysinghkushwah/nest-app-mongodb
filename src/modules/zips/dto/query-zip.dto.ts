import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryZipDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 10;
  @ApiPropertyOptional({ description: 'Filter by state abbreviation, e.g. AL' }) @IsOptional() @IsString() state?: string;
  @ApiPropertyOptional({ description: 'Search by city name' }) @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional({ description: 'Min population' }) @IsOptional() @Type(() => Number) @IsInt() min_pop?: number;
  @ApiPropertyOptional({ description: 'Max population' }) @IsOptional() @Type(() => Number) @IsInt() max_pop?: number;
}
