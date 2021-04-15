import { Body, Controller, Request, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import { USER_HEADERS } from 'src/common/constants';
import { NewDriverDto } from '../driver/dto/new-driver.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller('auth')
@ApiTags('Auth')
@ApiHeaders(USER_HEADERS)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('sign-up')
  async signUp(@Body(new ValidationPipe()) newUser: NewDriverDto) {
    return this.authService.signUp(newUser);
  }
}
