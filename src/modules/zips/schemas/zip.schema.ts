import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ZipDocument = Zip & Document;

@Schema({ strict: false, collection: 'zips' })
export class Zip {
  @Prop() city: string;
  @Prop() zip: string;
  @Prop({ type: Object }) loc: { y: number; x: number };
  @Prop() pop: number;
  @Prop() state: string;
}

export const ZipSchema = SchemaFactory.createForClass(Zip);
ZipSchema.index({ city: 'text' });
ZipSchema.index({ state: 1 });
ZipSchema.index({ zip: 1 });
ZipSchema.index({ pop: -1 });
