import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesSchemas, Company } from './schemas/company.schemas';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompaniesSchemas },
    ]),
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {}
