import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InspectionDocument = Inspection & Document;

@Schema({ strict: false, collection: 'inspections' })
export class Inspection {
  @Prop() id: string;
  @Prop() certificate_number: number;
  @Prop() business_name: string;
  @Prop() date: string;
  @Prop() result: string;
  @Prop() sector: string;
  @Prop({ type: Object }) address: {
    city: string; zip: string; street: string; number: number;
  };
}

export const InspectionSchema = SchemaFactory.createForClass(Inspection);
InspectionSchema.index({ business_name: 'text' });
InspectionSchema.index({ result: 1 });
InspectionSchema.index({ sector: 1 });
