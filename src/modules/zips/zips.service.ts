import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Zip, ZipDocument } from './schemas/zip.schema';
import { QueryZipDto } from './dto/query-zip.dto';

@Injectable()
export class ZipsService {
  constructor(@InjectModel(Zip.name) private model: Model<ZipDocument>) {}

  async findAll(query: QueryZipDto) {
    const { page = 1, limit = 10, state, city, min_pop, max_pop } = query;
    const filter: FilterQuery<ZipDocument> = {};
    if (state) filter.state = state.toUpperCase();
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (min_pop !== undefined || max_pop !== undefined) {
      filter.pop = {};
      if (min_pop !== undefined) filter.pop.$gte = min_pop;
      if (max_pop !== undefined) filter.pop.$lte = max_pop;
    }

    const [data, total] = await Promise.all([
      this.model.find(filter).sort({ pop: -1 }).skip((page - 1) * limit).limit(limit).lean().exec(),
      this.model.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) throw new NotFoundException(`Zip ${id} not found`);
    return doc;
  }

  async stateStats() {
    return this.model.aggregate([
      { $group: { _id: '$state', totalPop: { $sum: '$pop' }, cities: { $sum: 1 } } },
      { $sort: { totalPop: -1 } },
    ]);
  }

  async topCities(limit = 10) {
    return this.model.aggregate([
      { $group: { _id: { city: '$city', state: '$state' }, totalPop: { $sum: '$pop' } } },
      { $sort: { totalPop: -1 } },
      { $limit: limit },
    ]);
  }
}
