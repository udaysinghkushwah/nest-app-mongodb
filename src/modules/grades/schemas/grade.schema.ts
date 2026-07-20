import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GradeDocument = Grade & Document;

class Score {
  @Prop() type: string;
  @Prop() score: number;
}

@Schema({ strict: false, collection: 'grades' })
export class Grade {
  @Prop() student_id: number;
  @Prop() class_id: number;
  @Prop({ type: [{ type: Object }] }) scores: Score[];
}

export const GradeSchema = SchemaFactory.createForClass(Grade);
GradeSchema.index({ student_id: 1 });
GradeSchema.index({ class_id: 1 });
