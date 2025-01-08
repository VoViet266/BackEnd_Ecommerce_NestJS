import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RolesController } from './roles.controller';
import { Role, RoleSchema } from './Schemas/role.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RolesModule {}
