import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TripDocument = Trip & Document;

class GeoPoint {
  @Prop() type: string;
  @Prop([Number]) coordinates: number[];
}

@Schema({ strict: false, collection: 'trips' })
export class Trip {
  @Prop() tripduration: number;
  @Prop({ name: 'start station id' }) start_station_id: number;
  @Prop({ name: 'start station name' }) start_station_name: string;
  @Prop({ name: 'end station id' }) end_station_id: number;
  @Prop({ name: 'end station name' }) end_station_name: string;
  @Prop() bikeid: number;
  @Prop() usertype: string;
  @Prop({ name: 'birth year' }) birth_year: number;
  @Prop({ name: 'start time' }) start_time: Date;
  @Prop({ name: 'stop time' }) stop_time: Date;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.index({ usertype: 1 });
TripSchema.index({ start_time: -1 });
TripSchema.index({ tripduration: 1 });
