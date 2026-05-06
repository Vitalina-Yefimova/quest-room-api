import { Controller, Post, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { Public } from '../common/decorators/public.decorator';
import { SmsResponseDto } from '../sms/dto/sms-response.dto';
import { OtpVerifyRequestDto } from './dto/otp-verify-request.dto';
import { OtpSendRequestDto } from './dto/otp-send-request.dto';
import { SendResetPasswordEmailDto } from './dto/send-reset-password-email.dto';
import { EmailChangeRequestDto } from './dto/email-change-request.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('sign-up')
  async signUp(@Body() dto: SignUpRequestDto): Promise<{ email: string }> {
    return await this.authService.signUp(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() dto: SignInRequestDto): Promise<SignInResponseDto> {

    const data = await this.authService.signIn(dto);
    return new SignInResponseDto(data.access_token);
  }

  @Public()
  @Post('verify')
  async verify(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('send-otp')
  async sendOtp(
    @Body() dto: OtpSendRequestDto): Promise<SmsResponseDto> {
    return this.authService.sendOtp(dto)
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: OtpVerifyRequestDto) {
    return this.authService.verifyOtp(dto)
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(
      body.token,
      body.password)
  }

  @Public()
  @Post('send-reset-password-email')
  async sendResetPasswordEmail(@Body() dto: SendResetPasswordEmailDto) {
    return this.authService.sendResetPasswordEmail(
      dto.email,
      dto.frontendUrl)
  }

  @Post('change-email')
  async changeEmail(
    @Headers('authorization') authHeader: string,
    @Body() dto: EmailChangeRequestDto
  ) {
    const token = authHeader?.replace('Bearer ', '')
    return this.authService.changeEmail(token, dto.newEmail, dto.frontendUrl)
  }

  @Public()
  @Post('verify-new-email')
  async verifyNewEmail(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.verifyNewEmail(token);
  }
}
