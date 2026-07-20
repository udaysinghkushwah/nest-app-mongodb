import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// Feature modules
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { GradesModule } from './modules/grades/grades.module';
import { InspectionsModule } from './modules/inspections/inspections.module';
import { PostsModule } from './modules/posts/posts.module';
import { RoutesModule } from './modules/routes/routes.module';
import { TripsModule } from './modules/trips/trips.module';
import { ZipsModule } from './modules/zips/zips.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/sample_training', {
      autoIndex: false,
    }),
    // Feature modules — one per MongoDB collection
    UsersModule,
    CompaniesModule,
    GradesModule,
    InspectionsModule,
    PostsModule,
    RoutesModule,
    TripsModule,
    ZipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('{*path}');
  }
}
