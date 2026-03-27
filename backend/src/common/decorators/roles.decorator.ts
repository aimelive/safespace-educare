import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../types';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to one or more user roles.
 * Must be combined with RolesGuard (applied after JwtAuthGuard).
 *
 * @example @Roles('counselor', 'admin')
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
