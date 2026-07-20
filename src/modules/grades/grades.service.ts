import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Grade, GradeDocument } from './schemas/grade.schema';
import { QueryGradeDto } from './dto/query-grade.dto';

@Injectable()
export class GradesService {
  constructor(@InjectModel(Grade.name) private model: Model<GradeDocument>) {}

  async findAll(query: QueryGradeDto) {
    const { page = 1, limit = 10, student_id, class_id } = query;
    const filter: FilterQuery<GradeDocument> = {};
    if (student_id !== undefined) filter.student_id = student_id;
    if (class_id !== undefined) filter.class_id = class_id;

    const [data, total] = await Promise.all([
      this.model.find(filter).skip((page - 1) * limit).limit(limit).lean().exec(),
      this.model.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) throw new NotFoundException(`Grade ${id} not found`);
    return doc;
  }

  async statsByClass(class_id: number) {
    return this.model.aggregate([
      { $match: { class_id } },
      { $unwind: '$scores' },
      { $group: { _id: '$scores.type', avg: { $avg: '$scores.score' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
  }
}
