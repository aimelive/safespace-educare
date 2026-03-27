import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

function createMockContext(user: { role: string } | null, roles: string[]): ExecutionContext {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(roles),
  } as unknown as Reflector;

  const guard = new RolesGuard(reflector);

  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as unknown as Reflector;
    guard = new RolesGuard(reflector);
  });

  it('passes when no roles are required', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([]);
    const ctx = createMockContext({ role: 'student' }, []);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('passes when user has required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['counselor']);
    const ctx = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'counselor' } }) }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('throws ForbiddenException when role does not match', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const ctx = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'student' } }) }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when user is missing', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const ctx = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: null }) }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
