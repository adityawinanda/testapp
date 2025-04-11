import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { forwardRef, Inject } from "@nestjs/common";

@WebSocketGateway({cors: true})
export class Gateway {
  @WebSocketServer() server: Server

  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService
  ) {}

  @SubscribeMessage("send")
  sendMessage(@MessageBody() data: any) {
    this.chatService.publish(data);
  }

  @SubscribeMessage("join")
  join(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.join(data.roomId);    
  }

  sendToRoom(roomId: string, data: any) {
    this.server.to(roomId).emit("receive", data);
  }
}

