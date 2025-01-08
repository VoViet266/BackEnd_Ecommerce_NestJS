import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Role, RoleDocument } from './Schemas/role.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    let role = await this.roleModel.create({
      ...createRoleDto,
    });

    return role;
  }

  findAll() {
    return `This action returns all roles`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.roleModel.updateOne({ _id: id }, { ...updateRoleDto });
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found role');
    }
    return (await this.roleModel.findById(id)).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
