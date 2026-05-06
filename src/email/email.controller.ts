import { EmailService } from "./email.service";
import { Body, Controller, Post } from '@nestjs/common';
import { EmailRequestDto } from "./dto/email-request.dto";
import { EmailResponseDto } from "./dto/email-response.dto";
import { Public } from "../common/decorators/public.decorator";

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService
  ) { }

  @Public()
  @Post('send')
  async sendEmail(@Body() body: EmailRequestDto): Promise<EmailResponseDto> {
    return this.emailService.sendEmail(body);
  }
}
