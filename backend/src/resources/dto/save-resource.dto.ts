import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveResourceDto {
  @ApiProperty({ example: 'uuid-of-resource', description: 'ID of the resource to save' })
  @IsString()
  @IsNotEmpty()
  resource_id!: string;
}
