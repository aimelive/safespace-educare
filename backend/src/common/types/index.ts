export type UserRole = 'student' | 'counselor' | 'admin';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
