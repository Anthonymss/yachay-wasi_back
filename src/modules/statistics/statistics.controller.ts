import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ROLE } from 'src/shared/enum/role.enum';
import { StatisticsService } from './statistics.service';
import { RolesGuard } from 'src/shared/guards/roles.guard';
@Controller('statistics')
@ApiTags('Statistics')
@ApiBearerAuth()
@UseGuards(RolesGuard,JwtAuthGuard)
@Roles(ROLE.ADMIN)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getStatistics() {
    return this.statisticsService.getStatistics();
  }
}
