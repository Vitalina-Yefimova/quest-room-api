import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpSendRequest, SignInRequest, SignUpRequest } from './interfaces';
import { SignInResponse } from './interfaces';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SmsService } from '../sms/sms.service';
import { SmsResponse } from '../sms/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from '../mongo-schemas/otp.schema';
import { Model } from 'mongoose';
import { OtpVerifyRequest } from './interfaces';
import { EmailService } from '../email/email.service';
import { JWT_SECRET } from '../utils/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private smsService: SmsService,
    private emailService: EmailService,
    @InjectModel(Otp.name)
    private readonly otpModel: Model<OtpDocument>,
  ) { }

  async signUp(data: SignUpRequest): Promise<{ email: string }> {

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      authMethod: 'email'
    });

    const token = this.jwtService.sign({
      sub: user.id,
      type: 'verify',
    }, {
      secret: JWT_SECRET,
      expiresIn: '1h',
    })

    await this.emailService.sendEmail({
      email: user.email,
      metadata: {
        template: 'verify',
        subject: 'Verify your email',
        frontendUrl: data.frontendUrl,
        type: 'verify',
        token,
      },
    })

    return { email: user.email }
  }
  async validatePassword(email: string, password: string): Promise<{ id: number, role: string }> {
    const user = await this.usersService.getUser({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials')
    }
    if (!user.verify) {
      throw new UnauthorizedException('Email not verified')
    }
    return user
  }

  async signIn(user: SignInRequest): Promise<SignInResponse> {

    const userData = await this.validatePassword(user.email, user.password)

    const token = this.jwtService.sign({
      sub: userData.id,
      role: userData.role,
    })
    return {
      access_token: token
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: JWT_SECRET });
      if (payload.type !== 'verify') throw new BadRequestException('Invalid token type');

      await this.usersService.updateUser({ verify: true, emailVerified: true }, token);

      const user = await this.usersService.getUser({ token });

      const access_token = this.jwtService.sign(
        { sub: user.id, role: user.role },
        { secret: JWT_SECRET }
      );

      return { access_token };
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }


  async sendOtp(data: OtpSendRequest): Promise<SmsResponse> {
    const { phone } = data;

    const code = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpModel.create({
      phone,
      code,
      expiresAt,
      attempts: 0,
    });

    const message = `Your verification code is: ${code}`;
    await this.smsService.sendSms(phone, message)

    return { phone };
  }

  async verifyOtp(data: OtpVerifyRequest): Promise<{ access_token: string }> {
    const { phone, code } = data;

    const receivedCode = await this.otpModel
      .findOne({ phone })
      .sort({ createdAt: -1 });

    if (
      !receivedCode ||
      receivedCode.code !== (code as number) ||
      receivedCode.expiresAt < new Date()
      || receivedCode.attempts >= 3
    ) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpModel.deleteOne({ id: receivedCode.id });

    let user = await this.usersService.getUser({ phone })

    if (!user) {
      user = await this.usersService.createUser({
        phone,
        verify: true,
        authMethod: 'phone',
      });
    }

    const access_token = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    })

    return { access_token }
  }

  async sendResetPasswordEmail(email: string, frontendUrl: string) {
    const user = await this.usersService.getUser({ email })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const token = this.jwtService.sign({
      sub: user.id,
      type: 'reset-password',
    })

    await this.emailService.sendEmail({
      email: user.email,
      metadata: {
        template: 'reset-password',
        subject: 'Reset your password',
        frontendUrl,
        token,
      },
    })
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: JWT_SECRET });
      if (payload.type !== 'reset-password') {
        throw new BadRequestException('Invalid token type');
      }

      return await this.usersService.updateUser({
        password: newPassword,
      }, token);
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async changeEmail(token: string, newEmail: string, frontendUrl: string) {

    const payload = this.jwtService.verify(token);
    const userId = payload.sub;

    await this.usersService.updateUser({ newEmail }, token)

    const verifyToken = this.jwtService.sign({
      type: 'verify-email',
      sub: userId,
    });

    await this.emailService.sendEmail({
      email: newEmail,
      metadata: {
        template: 'verify-new-email',
        subject: 'Verify your new email',
        frontendUrl,
        token: verifyToken,
      },
    });

    return { message: 'Verification email sent to new address' };
  }

  async verifyNewEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'verify-email') {
        throw new BadRequestException('Invalid token type')
      }

      const user = await this.usersService.getUser({ token })
      if (!user || !user.newEmail) {
        throw new BadRequestException('No new email to verify')
      }

      return this.usersService.updateUser({
        email: user.newEmail,
        emailVerified: true,
      }, token)
    } catch {
      throw new BadRequestException('Invalid or expired token')
    }
  }
}