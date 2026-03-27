import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'uuid-of-chat-session', description: 'Target chat session ID' })
  @IsString()
  @IsNotEmpty()
  chat_id!: string;

  @ApiProperty({ example: 'Hello, I need some support today.', description: 'Message text' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
