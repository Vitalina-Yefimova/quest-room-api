import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload = exception instanceof HttpException ? exception.getResponse() : null;
    const message =
      typeof payload === 'string'
        ? payload
        : typeof payload === 'object' &&
            payload &&
            'message' in payload
          ? String((payload as { message: unknown }).message)
          : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      path: request.url,
      message,
    });
  }
}
