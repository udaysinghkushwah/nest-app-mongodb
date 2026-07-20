import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Unique email address' })
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @Prop({ trim: true })
  phone?: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive'], default: 'active' })
  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for faster queries
UserSchema.index({ name: 'text' });
UserSchema.index({ status: 1 });
