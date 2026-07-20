import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryTripDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 10;
  @ApiPropertyOptional({ enum: ['Customer', 'Subscriber'] }) @IsOptional() @IsString() usertype?: string;
  @ApiPropertyOptional({ description: 'Min trip duration in seconds' }) @IsOptional() @Type(() => Number) @IsInt() min_duration?: number;
  @ApiPropertyOptional({ description: 'Max trip duration in seconds' }) @IsOptional() @Type(() => Number) @IsInt() max_duration?: number;
}
