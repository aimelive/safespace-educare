import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ example: 'How I overcame exam anxiety', description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Here is my story…',
    description: 'Post body content',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Post anonymously (hides author name on GET /posts)',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value === true || value === 'true')
  @IsBoolean()
  is_anonymous?: boolean;
}
