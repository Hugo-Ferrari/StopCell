import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthRateLimitGuard } from './auth-rate-limit.guard';

function createContext(handlerName: string, ip = '127.0.0.1') {
  const setHeader = jest.fn();
  const handler = { [handlerName]: () => undefined }[handlerName];

  const context = {
    getHandler: () => handler,
    switchToHttp: () => ({
      getRequest: () => ({ ip, headers: {} }),
      getResponse: () => ({ setHeader }),
    }),
  } as unknown as ExecutionContext;

  return { context, setHeader };
}

describe('AuthRateLimitGuard', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('allows up to 10 login attempts per minute and blocks the 11th with 429', () => {
    const guard = new AuthRateLimitGuard();
    const { context, setHeader } = createContext('login', '10.0.0.1');

    for (let i = 0; i < 10; i++) {
      expect(guard.canActivate(context)).toBe(true);
    }

    let captured: unknown;
    try {
      guard.canActivate(context);
    } catch (err) {
      captured = err;
    }

    expect(captured).toBeInstanceOf(HttpException);
    expect((captured as HttpException).getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect(setHeader).toHaveBeenCalledWith('Retry-After', expect.any(String));
  });

  it('limits sensitive auth routes (esqueciSenha) to 5 attempts per minute', () => {
    const guard = new AuthRateLimitGuard();
    const { context } = createContext('esqueciSenha', '10.0.0.2');

    for (let i = 0; i < 5; i++) {
      expect(guard.canActivate(context)).toBe(true);
    }

    expect(() => guard.canActivate(context)).toThrow(HttpException);
  });

  it('isolates rate limits by IP and by route', () => {
    const guard = new AuthRateLimitGuard();
    const firstIp = createContext('esqueciSenha', '10.0.0.3');
    const secondIp = createContext('esqueciSenha', '10.0.0.4');
    const otherRoute = createContext('login', '10.0.0.3');

    for (let i = 0; i < 5; i++) {
      expect(guard.canActivate(firstIp.context)).toBe(true);
    }

    expect(() => guard.canActivate(firstIp.context)).toThrow(HttpException);
    expect(guard.canActivate(secondIp.context)).toBe(true);
    expect(guard.canActivate(otherRoute.context)).toBe(true);
  });

  it('resets the counter once the time window expires', () => {
    const guard = new AuthRateLimitGuard();
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000_000);
    const { context } = createContext('esqueciSenha', '10.0.0.5');

    for (let i = 0; i < 5; i++) {
      expect(guard.canActivate(context)).toBe(true);
    }
    expect(() => guard.canActivate(context)).toThrow(HttpException);

    nowSpy.mockReturnValue(1_000_000 + 60_001);
    expect(guard.canActivate(context)).toBe(true);
  });
});
