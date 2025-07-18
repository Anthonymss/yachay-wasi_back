import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Delete,
  Patch,
} from '@nestjs/common';
import { BeneficiaryService } from '../service/beneficiary.service';
import { CreateBeneficiaryDto } from '../dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from '../dto/update-beneficiary.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ROLE } from 'src/shared/enum/role.enum';
@ApiBearerAuth() //candadito
@UseGuards(RolesGuard,JwtAuthGuard)
@Roles(ROLE.ADMIN,ROLE.STAFF)
@ApiTags('Beneficiary')
@Controller('beneficiary')
export class BeneficiaryController {
  constructor(
    private readonly beneficiaryService: BeneficiaryService,
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
  @Get('find-one/:id')
  findOne(@Param('id') id: string) {
    return this.beneficiaryService.findOne(+id);
  }
  @Post('upload-excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    return this.beneficiaryService.uploadExcel(file);
  }
  @Delete('soft-delete/:id')
  async softDelete(@Param('id') id: string) {
    return this.beneficiaryService.softDelete(+id);
  }
  @Patch('restore/:id')
  async restore(@Param('id') id: string) {
    return this.beneficiaryService.restore(+id);
  }
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateBeneficiaryDto: UpdateBeneficiaryDto) {
    return this.beneficiaryService.update(+id, updateBeneficiaryDto);
  }
}
