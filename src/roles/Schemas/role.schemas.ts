import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schemas';

export class Role {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  isActive: boolean;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: Permission[];

  @Prop({
    type: Object,
  })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}
