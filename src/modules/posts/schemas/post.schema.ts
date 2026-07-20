import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ strict: false, collection: 'posts' })
export class Post {
  @Prop() body: string;
  @Prop() permalink: string;
  @Prop() author: string;
  @Prop() title: string;
  @Prop() tags: string[];
  @Prop() date: Date;
  @Prop({ type: [{ type: Object }] }) comments: {
    body: string; email: string; author: string;
  }[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ title: 'text', body: 'text' });
PostSchema.index({ author: 1 });
PostSchema.index({ date: -1 });
PostSchema.index({ tags: 1 });
