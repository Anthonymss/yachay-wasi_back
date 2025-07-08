import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BeneficiaryService } from '../service/beneficiary.service';
import { CreateBeneficiaryDto } from '../dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from '../dto/update-beneficiary.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExcelService } from 'src/shared/excel/excel.service';
import { FileInterceptor } from '@nestjs/platform-express';
//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth() //candadito
@ApiTags('Beneficiary')
@Controller('beneficiary')
export class BeneficiaryController {
  constructor(
    private readonly beneficiaryService: BeneficiaryService,
    private readonly excelService: ExcelService
  ) {}

  @Post()
  create(@Body() createBeneficiaryDto: CreateBeneficiaryDto) {
    return this.beneficiaryService.create(createBeneficiaryDto);
  }
  @Get('enums')
  getAllEnums() {
    return this.beneficiaryService.getAllEnums();
  } 
  @Get('page')
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.beneficiaryService.findAll(page, limit);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.beneficiaryService.findOne(+id);
  }
  @Post('upload-excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    return this.beneficiaryService.uploadExcel(file);
  }
}
