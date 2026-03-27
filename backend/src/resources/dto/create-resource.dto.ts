import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional, IsBoolean } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({ example: 'Managing Academic Stress', description: 'Resource title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'A practical guide to handling exam pressure and workload.', description: 'Short description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 'https://example.com/resource', description: 'Resource URL' })
  @IsUrl()
  url!: string;

  @ApiProperty({ example: 'Article', description: 'Category (e.g. Article, Book, Video, Exercise, Psychology)' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiPropertyOptional({ example: 'PDF', description: 'Optional sub-type label' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: true, default: true, description: 'Whether the resource is visible to students' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
