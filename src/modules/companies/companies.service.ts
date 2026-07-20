import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { QueryCompanyDto } from './dto/query-company.dto';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private model: Model<CompanyDocument>) {}

  async findAll(query: QueryCompanyDto) {
    const { page = 1, limit = 10, search, category_code, founded_year } = query;
    const filter: FilterQuery<CompanyDocument> = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    if (category_code) filter.category_code = category_code;
    if (founded_year) filter.founded_year = founded_year;

    const [data, total] = await Promise.all([
      this.model.find(filter).skip((page - 1) * limit).limit(limit).lean().exec(),
      this.model.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) throw new NotFoundException(`Company ${id} not found`);
    return doc;
  }

  async categories() {
    return this.model.distinct('category_code');
  }
}
