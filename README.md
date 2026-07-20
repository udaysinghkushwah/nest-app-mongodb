<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

NestJS REST API mapping MongoDB sample collections (users, companies, grades, posts, etc.) using Mongoose.

## API Reference

The application exposes REST API endpoints for multiple resources, mapping to MongoDB collection structures. 

All endpoints are prefixed with `/api`. Interactive Swagger documentation is available at `http://localhost:3000/api/docs`.

### 1. Users (`/api/users`)
- **`GET /api/users`** - List all users with support for pagination, search (by email/username), and status filtering (`?page=1&limit=10&search=john&status=active`).
- **`GET /api/users/stats`** - Get user statistics (total count, active, inactive).
- **`GET /api/users/:id`** - Get a single user by MongoDB ObjectId.
- **`POST /api/users`** - Create a new user.
- **`PUT /api/users/:id`** - Update an existing user by ID.
- **`DELETE /api/users/:id`** - Delete a user by ID.

### 2. Companies (`/api/companies`)
- **`GET /api/companies`** - List companies with support for pagination, category filtering, and search.
- **`GET /api/companies/categories`** - Retrieve a list of all distinct company categories.
- **`GET /api/companies/:id`** - Get a single company record by ID.

### 3. Grades (`/api/grades`)
- **`GET /api/grades`** - List grades with support for pagination and filtering by `student_id` or `class_id`.
- **`GET /api/grades/stats/class/:class_id`** - Retrieve average scores grouped by grading type (exam, quiz, homework) for a specific class.
- **`GET /api/grades/:id`** - Get a single grade record by ID.

### 4. Inspections (`/api/inspections`)
- **`GET /api/inspections`** - List business inspections with filtering by sector, city, and status/result.
- **`GET /api/inspections/stats/results`** - Get aggregated count of inspections grouped by result outcome.
- **`GET /api/inspections/stats/sectors`** - Retrieve the top 20 sectors by inspection count.
- **`GET /api/inspections/:id`** - Get a single inspection record by ID.

### 5. Posts (`/api/posts`)
- **`GET /api/posts`** - List blog posts with pagination, search, author, and tag filters (body content excluded for performance).
- **`GET /api/posts/stats/top-authors`** - Retrieve the top 10 authors by total post count.
- **`GET /api/posts/:id`** - Get a full post record by ID, including comments.

### 6. Routes (`/api/routes`)
- **`GET /api/routes`** - List flight routes with filtering by source/destination airport, airline, and number of stops.
- **`GET /api/routes/stats/airlines`** - Retrieve the top 15 airlines by total route count.
- **`GET /api/routes/stats/destinations`** - Retrieve the top 15 destination airports by route count.
- **`GET /api/routes/:id`** - Get a single flight route by ID.

### 7. Trips (`/api/trips`)
- **`GET /api/trips`** - List bike share / travel trips with filters for user type (subscriber/customer) and duration range.
- **`GET /api/trips/stats/duration`** - Get average, minimum, and maximum trip duration statistics.
- **`GET /api/trips/stats/usertype`** - Get trip count and average duration grouped by user type.
- **`GET /api/trips/:id`** - Get a single trip record by ID.

### 8. Zips (`/api/zips`)
- **`GET /api/zips`** - List zip codes/locations with state, city, and minimum/maximum population filters.
- **`GET /api/zips/stats/states`** - Get total population and city count aggregated by state.
- **`GET /api/zips/stats/top-cities`** - Get the top 10 cities by population.
- **`GET /api/zips/:id`** - Get a single zip code record by ID.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

If you find this project helpful, support my work by buying me a chai!

[![Buy Me A Chai](https://img.shields.io/badge/Buy%20Me%20a%20Chai-orange?style=for-the-badge&logo=coffee&logoColor=white)](https://www.buymeachai.in/toudaysinghkushwah)

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
