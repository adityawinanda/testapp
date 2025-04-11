import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Gateway } from './gateway';
import { ChatController } from './chat.controller';

@Module({
  providers: [Gateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
