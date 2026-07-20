import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { QueryPostDto } from './dto/query-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly svc: PostsService) {}

  @Get() @ApiOperation({ summary: 'List posts with search/author/tag filters (body excluded for performance)' })
  findAll(@Query() q: QueryPostDto) { return this.svc.findAll(q); }

  @Get('stats/top-authors') @ApiOperation({ summary: 'Top 10 authors by post count' })
  topAuthors() { return this.svc.topAuthors(); }

  @Get(':id') @ApiOperation({ summary: 'Get a full post with comments by ID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }
}
