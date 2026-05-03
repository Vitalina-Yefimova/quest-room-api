import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../mongo-schemas/otp.schema';
import { Twilio } from 'twilio';
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} from 'src/utils/config';

@Injectable()
export class SmsService {
  private readonly twilio: Twilio;
  constructor(@InjectModel(Otp.name) private otpModel: Model<OtpDocument>) {
    this.twilio = new Twilio(TWILIO_ACCOUNT_SID || '', TWILIO_AUTH_TOKEN || '');
  }

  async sendSms(phone: string, message: string): Promise<void> {

    await this.twilio.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });
  }
}