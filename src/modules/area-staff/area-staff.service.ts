import { Injectable } from '@nestjs/common';
import { CreateAreaStaffDto } from './dto/create-area-staff.dto';
import { UpdateAreaStaffDto } from './dto/update-area-staff.dto';

@Injectable()
export class AreaStaffService {
  create(createAreaStaffDto: CreateAreaStaffDto) {
    return 'This action adds a new areaStaff';
  }

  findAll() {
    return `This action returns all areaStaff`;
  }

  findOne(id: number) {
    return `This action returns a #${id} areaStaff`;
  }

  update(id: number, updateAreaStaffDto: UpdateAreaStaffDto) {
    return `This action updates a #${id} areaStaff`;
  }

  remove(id: number) {
    return `This action removes a #${id} areaStaff`;
  }
}
