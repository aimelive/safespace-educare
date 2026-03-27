import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional, IsBoolean } from 'class-validator';

export class UpdateResourceDto {
  @ApiPropertyOptional({ example: 'Managing Academic Stress' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'A practical guide to handling exam pressure.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/resource' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ example: 'Article' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'PDF' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
