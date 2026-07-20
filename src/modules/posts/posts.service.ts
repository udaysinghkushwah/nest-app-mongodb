import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { QueryPostDto } from './dto/query-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private model: Model<PostDocument>) {}

  async findAll(query: QueryPostDto) {
    const { page = 1, limit = 10, search, author, tag } = query;
    const filter: FilterQuery<PostDocument> = {};
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { body: { $regex: search, $options: 'i' } },
    ];
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (tag) filter.tags = tag;

    const [data, total] = await Promise.all([
      this.model.find(filter, { body: 0, comments: 0 }) // exclude heavy fields in list
        .sort({ date: -1 }).skip((page - 1) * limit).limit(limit).lean().exec(),
      this.model.countDocuments(filter),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) throw new NotFoundException(`Post ${id} not found`);
    return doc;
  }

  async topAuthors() {
    return this.model.aggregate([
      { $group: { _id: '$author', posts: { $sum: 1 }, totalComments: { $sum: { $size: { $ifNull: ['$comments', []] } } } } },
      { $sort: { posts: -1 } },
      { $limit: 10 },
    ]);
  }
}
