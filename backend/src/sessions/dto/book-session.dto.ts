import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookSessionDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-…', description: 'ID of the counselor to book' })
  @IsString()
  @IsNotEmpty()
  counselor_id!: string;

  @ApiProperty({ example: '2024-05-15', description: 'Session date (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: '14:00', description: 'Session start time (HH:MM)' })
  @IsString()
  @IsNotEmpty()
  time!: string;

  @ApiProperty({ example: 'Anxiety and stress management', description: 'Session topic' })
  @IsString()
  @IsNotEmpty()
  topic!: string;
}
