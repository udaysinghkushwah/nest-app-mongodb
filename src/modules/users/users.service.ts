import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<UserDocument> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const [data, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).lean().exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    return user as User;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.userModel.findOne({ email: dto.email }).lean().exec();
    if (exists) throw new ConflictException(`Email "${dto.email}" is already registered`);
    const created = await this.userModel.create(dto as any);
    return created.toObject();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    if (dto.email) {
      const exists = await this.userModel
        .findOne({ email: dto.email, _id: { $ne: id } })
        .lean()
        .exec();
      if (exists) throw new ConflictException(`Email "${dto.email}" is already in use`);
    }
    const updated = await this.userModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException(`User with id "${id}" not found`);
    return updated as User;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.userModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`User with id "${id}" not found`);
    return { message: `User "${res.name}" deleted successfully` };
  }

  async stats() {
    const [total, active, inactive] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ status: 'active' }),
      this.userModel.countDocuments({ status: 'inactive' }),
    ]);
    return { total, active, inactive };
  }
}
