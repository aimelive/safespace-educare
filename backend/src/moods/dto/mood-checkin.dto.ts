import { IsString, IsOptional, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MoodCheckinDto {
  @ApiProperty({
    example: 'anxious',
    description: 'Mood label (e.g. happy, sad, anxious, calm)',
  })
  @IsString()
  @IsNotEmpty()
  mood!: string;

  @ApiPropertyOptional({
    example: 7,
    minimum: 1,
    maximum: 10,
    default: 5,
    description: 'Intensity on a 1–10 scale',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  intensity?: number;

  @ApiPropertyOptional({ example: 'Feeling overwhelmed by exams.', description: 'Optional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
