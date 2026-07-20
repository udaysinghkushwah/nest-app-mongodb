import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inspection, InspectionSchema } from './schemas/inspection.schema';
import { InspectionsService } from './inspections.service';
import { InspectionsController } from './inspections.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Inspection.name, schema: InspectionSchema }])],
  controllers: [InspectionsController],
  providers: [InspectionsService],
})
export class InspectionsModule {}
