import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createSuccessResponse, SuccessResponse, LoginInputDto, RegistrationInputDto} from './dto';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() credential: LoginInputDto): Promise<SuccessResponse> {
    const jwtToken = await this.authService.login(credential.usernameOrEmail, credential.password);

    const payload = {
      token: jwtToken,
    }

    return createSuccessResponse(payload);
  }

  @Post("register")
  async register(@Body() info: RegistrationInputDto): Promise<SuccessResponse> {
    await this.authService.register(info.username, info.email, info.password);
    return createSuccessResponse(true);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("isloggedin")
  isLoggedIn(): SuccessResponse {
    return createSuccessResponse(true);
  }
}
