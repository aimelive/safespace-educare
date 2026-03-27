import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVictoryDto {
  @ApiProperty({ example: 'Finished my first 5K run!', description: 'Short victory title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'I trained for 3 months and finally did it.', description: 'Longer description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'fitness',
    default: 'general',
    description: 'Category (e.g. academic, fitness, social, general)',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
