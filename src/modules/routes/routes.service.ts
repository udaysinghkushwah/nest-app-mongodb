import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Route, RouteDocument } from './schemas/route.schema';
import { QueryRouteDto } from './dto/query-route.dto';

@Injectable()
export class RoutesService {
  constructor(@InjectModel(Route.name) private model: Model<RouteDocument>) {}

  async findAll(query: QueryRouteDto) {
    const { page = 1, limit = 10, src_airport, dst_airport, airline, stops } = query;
    const filter: FilterQuery<RouteDocument> = {};
    if (src_airport) filter.src_airport = src_airport.toUpperCase();
    if (dst_airport) filter.dst_airport = dst_airport.toUpperCase();
    if (airline) filter['airline.name'] = { $regex: airline, $options: 'i' };
    if (stops !== undefined) filter.stops = stops;

    const [data, total] = await Promise.all([
      this.model.find(filter).skip((page - 1) * limit).limit(limit).lean().exec(),
      this.model.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) throw new NotFoundException(`Route ${id} not found`);
    return doc;
  }

  async topAirlines() {
    return this.model.aggregate([
      { $group: { _id: '$airline.name', routes: { $sum: 1 } } },
      { $sort: { routes: -1 } },
      { $limit: 15 },
    ]);
  }

  async topDestinations() {
    return this.model.aggregate([
      { $group: { _id: '$dst_airport', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);
  }
}
