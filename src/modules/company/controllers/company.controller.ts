import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';
import { Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';
import { CompanyService } from '../services/company.service';
import { CompanySummary } from '../enums/swagger-summary';
import { CompanyMessage } from '../enums/messages.enum';
import { CompanyEntity } from '../entities/company.entity';

@Controller('companies')
@ApiTags('Companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post()
  @ApiOperation({ summary: CompanySummary.CREATE })
  @ApiResponse({
    status: 201,
    description: CompanyMessage.CREATED,
    type: CompanyEntity,
  })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async create(
    @Body() createDto: CreateCompanyDto,
  ): Promise<{ message: string; data: CompanyEntity }> {
    return this.companyService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: CompanySummary.GET_ALL })
  @ApiResponse({
    status: 200,
    description: CompanyMessage.RETRIEVED_ALL,
    type: [CompanyEntity],
  })
  async findAll(): Promise<{ message: string; data: CompanyEntity[] }> {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: CompanySummary.GET_ONE })
  @ApiResponse({
    status: 200,
    description: CompanyMessage.RETRIEVED_ONE,
    type: CompanyEntity,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; data: CompanyEntity }> {
    return this.companyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: CompanySummary.UPDATE })
  @ApiResponse({
    status: 200,
    description: CompanyMessage.UPDATED,
    type: CompanyEntity,
  })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCompanyDto,
  ): Promise<{ message: string; data: CompanyEntity }> {
    return this.companyService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: CompanySummary.DELETE })
  @ApiResponse({
    status: 200,
    description: CompanyMessage.DELETED,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.companyService.remove(id);
  }
}
