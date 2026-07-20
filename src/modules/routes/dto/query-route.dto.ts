import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryRouteDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 10;
  @ApiPropertyOptional({ description: 'Source airport IATA code, e.g. KZN' }) @IsOptional() @IsString() src_airport?: string;
  @ApiPropertyOptional({ description: 'Destination airport IATA code, e.g. LED' }) @IsOptional() @IsString() dst_airport?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() airline?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() stops?: number;
}
