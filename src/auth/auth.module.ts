import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '../email/email.module';
import { Otp, OtpSchema } from '../mongo-schemas/otp.schema';
import { PrismaService } from '../prisma/prisma.service';
import { SmsModule } from '../sms/sms.module';
import { UsersModule } from '../users/users.module';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../utils/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => EmailModule),
    forwardRef(() => SmsModule),
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtAuthGuard, GoogleStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
