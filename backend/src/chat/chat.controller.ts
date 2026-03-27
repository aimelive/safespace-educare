import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { StartChatDto } from './dto/start-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/types';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new anonymous chat session' })
  @ApiResponse({ status: 201, description: 'Chat session created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  startSession(@Body() dto: StartChatDto, @CurrentUser() user: JwtPayload) {
    return this.chatService.startSession(dto, user.id);
  }

  @Post('message')
  @ApiOperation({ summary: 'Send a message to a chat session' })
  @ApiResponse({ status: 201, description: 'Message saved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  sendMessage(@Body() dto: SendMessageDto, @CurrentUser() user: JwtPayload) {
    return this.chatService.sendMessage(dto, user.id);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'List all chat sessions for the current user' })
  @ApiResponse({ status: 200, description: 'List of chat sessions.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getSessions(@CurrentUser() user: JwtPayload) {
    return this.chatService.getSessions(user.id, user.role);
  }

  @Get(':chatId')
  @ApiOperation({ summary: 'Retrieve all messages for a chat session' })
  @ApiParam({ name: 'chatId', description: 'Chat session UUID' })
  @ApiResponse({ status: 200, description: 'Ordered list of chat messages.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMessages(@Param('chatId') chatId: string) {
    return this.chatService.getMessages(chatId);
  }
}
