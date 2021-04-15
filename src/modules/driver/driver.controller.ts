import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/user.decorator';


@ApiTags('Driver')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) { }

  @Get('profile')
  async myProfile(
    @GetUser('id') driverId: number,
    ) {
    return this.driverService.findById(driverId);
  }

}
