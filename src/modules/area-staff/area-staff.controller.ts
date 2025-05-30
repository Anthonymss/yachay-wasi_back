import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AreaStaffService } from './area-staff.service';
import { CreateAreaStaffDto } from './dto/create-area-staff.dto';
import { UpdateAreaStaffDto } from './dto/update-area-staff.dto';

@Controller('area-staff')
export class AreaStaffController {
  constructor(private readonly areaStaffService: AreaStaffService) {}

  @Post()
  create(@Body() createAreaStaffDto: CreateAreaStaffDto) {
    return this.areaStaffService.create(createAreaStaffDto);
  }

  @Get()
  findAll() {
    return this.areaStaffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areaStaffService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAreaStaffDto: UpdateAreaStaffDto,
  ) {
    return this.areaStaffService.update(+id, updateAreaStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areaStaffService.remove(+id);
  }
}
