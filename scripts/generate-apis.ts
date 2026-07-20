#!/usr/bin/env ts-node
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

type FieldType = 'String' | 'Number' | 'Boolean' | 'Date' | 'Array' | 'Object' | 'Any';

function inferType(value: any): FieldType {
  if (value === null || value === undefined) return 'Any';
  if (Array.isArray(value)) return 'Array';
  if (value instanceof Date) return 'Date';
  const t = typeof value;
  if (t === 'string') return 'String';
  if (t === 'number') return 'Number';
  if (t === 'boolean') return 'Boolean';
  if (t === 'object') return 'Object';
  return 'Any';
}

function mergeTypes(a: FieldType, b: FieldType): FieldType {
  if (a === b) return a;
  if (a === 'Any') return b;
  if (b === 'Any') return a;
  return 'Any';
}

function fieldTypeToMongoose(type: FieldType): string {
  switch (type) {
    case 'String':
      return 'String';
    case 'Number':
      return 'Number';
    case 'Boolean':
      return 'Boolean';
    case 'Date':
      return 'Date';
    case 'Array':
      return '[Mixed]';
    case 'Object':
      return 'Mixed';
    default:
      return 'Mixed';
  }
}

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Please set MONGO_URI environment variable (or update .env).');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();

  // try to pull db name from uri or use default
  const dbNameFromUri = uri.split('/').pop()?.split('?')[0];
  const dbName = process.env.MONGO_DB || (dbNameFromUri || 'test');
  const db = client.db(dbName);

  console.log(`Connected to DB: ${db.databaseName}`);

  const collections = await db.listCollections().toArray();
  for (const coll of collections) {
    const name = coll.name;
    console.log(`Inspecting collection: ${name}`);
    const docs = await db.collection(name).find({}).limit(50).toArray();

    const fieldTypes: Record<string, FieldType> = {};
    for (const doc of docs) {
      for (const [k, v] of Object.entries(doc)) {
        if (k === '_id') continue;
        const t = inferType(v);
        fieldTypes[k] = fieldTypes[k] ? mergeTypes(fieldTypes[k], t) : t;
      }
    }

    // ensure output dir
    const moduleDir = path.join(process.cwd(), 'src', 'modules', name);
    fs.mkdirSync(moduleDir, { recursive: true });

    // write schema file
    const schemaLines = ["import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';", "import { Document } from 'mongoose';", '', `export type ${capitalize(name)}Document = ${capitalize(name)} & Document;`, '', `@Schema({ timestamps: true })`, `export class ${capitalize(name)} {`];
    for (const [f, t] of Object.entries(fieldTypes)) {
      schemaLines.push(`  @Prop()`);
      schemaLines.push(`  ${f}: ${fieldTypeTsType(t)};`);
      schemaLines.push('');
    }
    schemaLines.push('}');
    schemaLines.push('', `export const ${capitalize(name)}Schema = SchemaFactory.createForClass(${capitalize(name)});`);
    const schemasDir = path.join(moduleDir, 'schemas');
    fs.mkdirSync(schemasDir, { recursive: true });
    fs.writeFileSync(path.join(schemasDir, `${name}.schema.ts`), schemaLines.join('\n'));

    // write module file
    const moduleContent = `import { Module } from '@nestjs/common';\nimport { MongooseModule } from '@nestjs/mongoose';\nimport { ${capitalize(name)}, ${capitalize(name)}Schema } from './schemas/${name}.schema';\nimport { ${capitalize(name)}Service } from './${name}.service';\nimport { ${capitalize(name)}Controller } from './${name}.controller';\n\n@Module({\n  imports: [MongooseModule.forFeature([{ name: ${capitalize(name)}.name, schema: ${capitalize(name)}Schema }])],\n  controllers: [${capitalize(name)}Controller],\n  providers: [${capitalize(name)}Service],\n  exports: [${capitalize(name)}Service],\n})\nexport class ${capitalize(name)}Module {}\n`;
    fs.writeFileSync(path.join(moduleDir, `${name}.module.ts`), moduleContent);

    // service
    const serviceContent = `import { Injectable, NotFoundException } from '@nestjs/common';\nimport { InjectModel } from '@nestjs/mongoose';\nimport { Model } from 'mongoose';\nimport { ${capitalize(name)}, ${capitalize(name)}Document } from './schemas/${name}.schema';\nimport { Create${capitalize(name)}Dto } from './dto/create-${name}.dto';\nimport { Update${capitalize(name)}Dto } from './dto/update-${name}.dto';\n\n@Injectable()\nexport class ${capitalize(name)}Service {\n  constructor(@InjectModel(${capitalize(name)}.name) private model: Model<${capitalize(name)}Document>) {}\n\n  async findAll() {\n    return this.model.find().lean().exec();\n  }\n\n  async findOne(id: string) {\n    const res = await this.model.findById(id).lean().exec();\n    if (!res) throw new NotFoundException('${capitalize(name)} not found');\n    return res;\n  }\n\n  async create(dto: Create${capitalize(name)}Dto) {\n    const created = await this.model.create(dto as any);\n    return created.toObject();\n  }\n\n  async update(id: string, dto: Update${capitalize(name)}Dto) {\n    const updated = await this.model.findByIdAndUpdate(id, dto as any, { new: true }).lean().exec();\n    if (!updated) throw new NotFoundException('${capitalize(name)} not found');\n    return updated;\n  }\n\n  async remove(id: string) {\n    const res = await this.model.findByIdAndDelete(id).exec();\n    if (!res) throw new NotFoundException('${capitalize(name)} not found');\n  }\n}\n`;
    fs.writeFileSync(path.join(moduleDir, `${name}.service.ts`), serviceContent);

    // controller
    const controllerContent = `import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';\nimport { ${capitalize(name)}Service } from './${name}.service';\nimport { Create${capitalize(name)}Dto } from './dto/create-${name}.dto';\nimport { Update${capitalize(name)}Dto } from './dto/update-${name}.dto';\n\n@Controller('${name}')\nexport class ${capitalize(name)}Controller {\n  constructor(private readonly service: ${capitalize(name)}Service) {}\n\n  @Get()\n  findAll() {\n    return this.service.findAll();\n  }\n\n  @Get(':id')\n  findOne(@Param('id') id: string) {\n    return this.service.findOne(id);\n  }\n\n  @Post()\n  create(@Body() dto: Create${capitalize(name)}Dto) {\n    return this.service.create(dto);\n  }\n\n  @Put(':id')\n  update(@Param('id') id: string, @Body() dto: Update${capitalize(name)}Dto) {\n    return this.service.update(id, dto);\n  }\n\n  @Delete(':id')\n  remove(@Param('id') id: string) {\n    return this.service.remove(id);\n  }\n}\n`;
    fs.writeFileSync(path.join(moduleDir, `${name}.controller.ts`), controllerContent);

    // dto folder and simple dtos
    const dtoDir = path.join(moduleDir, 'dto');
    fs.mkdirSync(dtoDir, { recursive: true });
    const createDtoLines = ['export class Create' + capitalize(name) + 'Dto {'];
    const updateDtoLines = ['export class Update' + capitalize(name) + 'Dto {'];
    for (const [f, t] of Object.entries(fieldTypes)) {
      createDtoLines.push(`  ${f}: ${fieldTypeTsType(t)};`);
      updateDtoLines.push(`  ${f}?: ${fieldTypeTsType(t)};`);
    }
    createDtoLines.push('}');
    updateDtoLines.push('}');
    fs.writeFileSync(path.join(dtoDir, `create-${name}.dto.ts`), createDtoLines.join('\n'));
    fs.writeFileSync(path.join(dtoDir, `update-${name}.dto.ts`), updateDtoLines.join('\n'));

    console.log(`Generated module for collection: ${name}`);
  }

  await client.close();
  console.log('Generation complete.');
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fieldTypeTsType(t: FieldType) {
  switch (t) {
    case 'String':
      return 'string';
    case 'Number':
      return 'number';
    case 'Boolean':
      return 'boolean';
    case 'Date':
      return 'Date';
    case 'Array':
      return 'any[]';
    case 'Object':
      return 'Record<string, any>';
    default:
      return 'any';
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
