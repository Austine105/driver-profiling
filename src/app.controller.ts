import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { configService } from './common/config/config.service';


@Controller()
export class AppController {

  @ApiTags('Index')
  @Get()
  getIndex(): string {
    return `You have reached ${configService.getAppName().toUpperCase()} routes.`;
  }
}
