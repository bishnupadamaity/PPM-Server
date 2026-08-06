import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult, PaginationMeta } from '../dto/paginated-result.dto';

export interface ApiResponse<T> {
  status: number;
  success: true;
  data: T;
  pagination?: PaginationMeta;
}

/**
 * Wraps controller return values in the `{ status, success, data, pagination? }`
 * envelope the client expects. `PaginatedResult` is unwrapped so its
 * `data`/`pagination` land at the top level instead of nesting under `data.data`.
 *
 * `status` mirrors Nest's own default status-by-method (201 for POST, 200
 * otherwise) rather than reading `response.statusCode`, which Nest hasn't
 * set yet at the point interceptors run. No handler in this app overrides
 * it with `@HttpCode()`; if one ever does, this will need to read that
 * metadata too.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const status = request.method === 'POST' ? 201 : 200;

    return next.handle().pipe(
      map((result: unknown) => {
        if (result instanceof PaginatedResult) {
          return {
            status,
            success: true,
            data: result.data,
            pagination: result.pagination,
          };
        }
        return { status, success: true, data: result };
      }),
    );
  }
}
