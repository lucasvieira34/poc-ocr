import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('LoggingInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    const { body, method, url } = request;

    this.logger.verbose(`>>> ${method} ${url} ${JSON.stringify(body || {})}`);

    return next
      .handle()
      .pipe(tap((response) => this.logger.verbose(`<<< ${method} ${url} ${JSON.stringify(response || {})}`)));
  }
}
