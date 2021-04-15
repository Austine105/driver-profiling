import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');
import { JwtService } from '@nestjs/jwt';
import { DriverService } from '../driver/driver.service';
import { NewDriverDto } from '../driver/dto/new-driver.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly driverService: DriverService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.driverService.findByUsername(email);

      if (user && await bcrypt.compare(pass, user.password)) {
        const { email, id } = user;
        return { email, id };
      }
      return null;
    }
    catch (e) {
      return null;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(newUser: NewDriverDto) {
    const createdUser = await this.driverService.create(newUser);
    const { id, email } = createdUser;

    const accessToken = this.jwtService.sign({
      email: createdUser.email,
      sub: createdUser.id
    });

    return {
      user: { id, email },
      accessToken
    };
  }
}
