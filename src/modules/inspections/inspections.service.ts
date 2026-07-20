import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Inspection, InspectionDocument } from './schemas/inspection.schema';
import { QueryInspectionDto } from './dto/query-inspection.dto';

@Injectable()
export class InspectionsService {
  constructor(@InjectModel(Inspection.name) private model: Model<InspectionDocument>) {}

  async findAll(query: QueryInspectionDto) {
    const { page = 1, limit = 10, search, result, sector, city } = query;
    const filter: FilterQuery<InspectionDocument> = {};
    if (search) filter.business_name = { $regex: search, $options: 'i' };
    if (result) filter.result = result;
    if (sector) filter.sector = { $regex: sector, $options: 'i' };
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };

    const [data, total] = await Promise.all([
      this.model.find(filter).skip((page - 1) * limit).limit(limit).lean().exec(),
      this.model.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) throw new NotFoundException(`Inspection ${id} not found`);
    return doc;
  }

  async resultStats() {
    return this.model.aggregate([
      { $group: { _id: '$result', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  async sectorStats() {
    return this.model.aggregate([
      { $group: { _id: '$sector', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
  }
}
