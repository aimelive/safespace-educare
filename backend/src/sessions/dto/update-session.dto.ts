import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSessionDto {
  @ApiPropertyOptional({
    example: 'completed',
    enum: ['scheduled', 'completed', 'cancelled'],
    description: 'New session status',
  })
  @IsOptional()
  @IsEnum(['scheduled', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({
    example: 'Student showed great progress.',
    description: 'Counselor notes for the session',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
