import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Registered email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securePass123', description: 'Account password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
