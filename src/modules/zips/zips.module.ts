import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Zip, ZipSchema } from './schemas/zip.schema';
import { ZipsService } from './zips.service';
import { ZipsController } from './zips.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Zip.name, schema: ZipSchema }])],
  controllers: [ZipsController],
  providers: [ZipsService],
})
export class ZipsModule {}
