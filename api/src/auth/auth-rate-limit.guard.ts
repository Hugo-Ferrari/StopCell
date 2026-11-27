import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 10,
  windowMs: 60_000,
};

const ROUTE_RATE_LIMITS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 10, windowMs: 60_000 },
  cadastrar: { maxAttempts: 5, windowMs: 60_000 },
  esqueciSenha: { maxAttempts: 5, windowMs: 60_000 },
  redefinirSenha: { maxAttempts: 5, windowMs: 60_000 },
};

const MAX_STORE_SIZE = 10_000;

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private readonly store = new Map<string, RateLimitEntry>();

  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const handlerName = context.getHandler().name;
    const config = ROUTE_RATE_LIMITS[handlerName] ?? DEFAULT_RATE_LIMIT;
    const clientIp = this.extractClientIp(request);
    const key = `${handlerName}:${clientIp}`;

    const now = Date.now();
    this.cleanupExpiredIfNeeded(now);

    const existing = this.store.get(key);
    if (!existing || existing.resetAt <= now) {
      this.store.set(key, { count: 1, resetAt: now + config.windowMs });
      return true;
    }

    if (existing.count >= config.maxAttempts) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      response?.setHeader?.('Retry-After', String(retryAfterSeconds));

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Muitas tentativas. Aguarde alguns instantes antes de tentar novamente.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    existing.count += 1;
    return true;
  }

  private extractClientIp(request: any): string {
    const forwarded = request?.headers?.['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
      return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
      return String(forwarded[0]).trim();
    }
    return request?.ip || request?.socket?.remoteAddress || 'unknown';
  }

  private cleanupExpiredIfNeeded(now: number): void {
    if (this.store.size < MAX_STORE_SIZE) return;

    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt <= now) {
        this.store.delete(key);
      }
    }
  }
}
