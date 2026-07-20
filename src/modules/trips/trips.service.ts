import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Trip, TripDocument } from './schemas/trip.schema';
import { QueryTripDto } from './dto/query-trip.dto';

@Injectable()
export class TripsService {
  constructor(@InjectModel(Trip.name) private model: Model<TripDocument>) {}

  async findAll(query: QueryTripDto) {
    const { page = 1, limit = 10, usertype, min_duration, max_duration } = query;
    const filter: FilterQuery<TripDocument> = {};
    if (usertype) filter.usertype = usertype;
    if (min_duration !== undefined || max_duration !== undefined) {
      filter.tripduration = {};
      if (min_duration !== undefined) filter.tripduration.$gte = min_duration;
      if (max_duration !== undefined) filter.tripduration.$lte = max_duration;
    }

    const [data, total] = await Promise.all([
      this.model.find(filter).sort({ 'start time': -1 }).skip((page - 1) * limit).limit(limit).lean().exec(),
      this.model.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) throw new NotFoundException(`Trip ${id} not found`);
    return doc;
  }

  async durationStats() {
    const result = await this.model.aggregate([
      { $group: {
        _id: null,
        avgDuration: { $avg: '$tripduration' },
        minDuration: { $min: '$tripduration' },
        maxDuration: { $max: '$tripduration' },
        total: { $sum: 1 },
      }},
    ]);
    return result[0] || {};
  }

  async usertypeStats() {
    return this.model.aggregate([
      { $group: { _id: '$usertype', count: { $sum: 1 }, avgDuration: { $avg: '$tripduration' } } },
      { $sort: { count: -1 } },
    ]);
  }
}
