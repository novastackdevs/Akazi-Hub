import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.register(dto);
    response.cookie(this.auth.refreshCookieName(), result.refreshToken, this.auth.cookieOptions());
    const { refreshToken: _refreshToken, ...safe } = result;
    return safe;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(dto);
    response.cookie(this.auth.refreshCookieName(), result.refreshToken, this.auth.cookieOptions());
    const { refreshToken: _refreshToken, ...safe } = result;
    return safe;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = request.cookies?.[this.auth.refreshCookieName()] as string | undefined;
    if (!token) throw new UnauthorizedException('Refresh session missing');
    const result = await this.auth.refresh(token);
    response.cookie(this.auth.refreshCookieName(), result.refreshToken, this.auth.cookieOptions());
    return { accessToken: result.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.auth.logout(request.cookies?.[this.auth.refreshCookieName()]);
    response.clearCookie(this.auth.refreshCookieName(), { ...this.auth.cookieOptions(), maxAge: undefined });
  }
}
