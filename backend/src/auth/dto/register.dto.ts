import {
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  MinLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securePass123', minLength: 6, description: 'Password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 20, minimum: 13, maximum: 100, description: 'Age in years' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(13)
  @Max(100)
  age?: number;

  @ApiPropertyOptional({
    example: 'student',
    enum: ['student', 'counselor', 'admin'],
    default: 'student',
    description: 'User role',
  })
  @IsOptional()
  @IsEnum(['student', 'counselor', 'admin'])
  role?: string;

  @ApiPropertyOptional({ example: 'ALU Rwanda', description: 'School or institution name' })
  @IsOptional()
  @IsString()
  school?: string;
}
