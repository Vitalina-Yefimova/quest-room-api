import { BadRequestException, Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailRequest, EmailResponse } from './interfaces';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as handlebars from 'handlebars';
import { SENDGRID_API_KEY } from '../utils/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    sgMail.setApiKey(SENDGRID_API_KEY || '');
  }

  async sendEmail(data: EmailRequest): Promise<EmailResponse> {

    const { email, metadata, body } = data;
    const { template, subject, ...rest } = metadata;

    if (!template || !subject) {
      throw new BadRequestException('Template and subject must be provided in metadata')
    }

    const html = this.renderTemplate(template, { ...rest, body });

    await sgMail.send({
      to: email,
      from: 'escape_room@meta.ua',
      subject,
      html,
    });

    return {
      success: true
    }
  }

  private renderTemplate(templateName: string, data: Record<string, any>): string {
    const filePath = join(__dirname, 'templates', `${templateName}.hbs`);
    const source = readFileSync(filePath, 'utf-8');
    const compiled = handlebars.compile(source);
    return compiled(data);
  }
}