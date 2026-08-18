import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, default: 'Backlog' })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  lead: Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  members: Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team' })
  teams: Types.ObjectId;

  @Prop({ required: true })
  dueDate: string;

  @Prop()
  priority: string;

  @Prop({ type: [String] })
  labels: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
