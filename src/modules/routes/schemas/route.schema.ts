import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RouteDocument = Route & Document;

class Airline {
  @Prop() id: number;
  @Prop() name: string;
  @Prop() alias: string;
  @Prop() iata: string;
}

@Schema({ strict: false, collection: 'routes' })
export class Route {
  @Prop({ type: Object }) airline: Airline;
  @Prop() src_airport: string;
  @Prop() dst_airport: string;
  @Prop() codeshare: string;
  @Prop() stops: number;
  @Prop() airplane: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
RouteSchema.index({ src_airport: 1 });
RouteSchema.index({ dst_airport: 1 });
RouteSchema.index({ 'airline.name': 1 });
