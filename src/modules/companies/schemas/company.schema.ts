import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ strict: false, collection: 'companies' })
export class Company {
  @Prop() name: string;
  @Prop() permalink: string;
  @Prop() homepage_url: string;
  @Prop() category_code: string;
  @Prop() number_of_employees: number;
  @Prop() founded_year: number;
  @Prop() description: string;
  @Prop() twitter_username: string;
  @Prop() email_address: string;
  @Prop() phone_number: string;
  @Prop() overview: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
CompanySchema.index({ name: 'text', description: 'text' });
CompanySchema.index({ category_code: 1 });
CompanySchema.index({ founded_year: 1 });
