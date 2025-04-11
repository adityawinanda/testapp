import { EventPattern, Payload } from "@nestjs/microservices";
import { Gateway } from "./gateway";
import { Controller, forwardRef, Inject } from "@nestjs/common";

@Controller()
export class ChatController {
  constructor(
    @Inject(forwardRef(() => Gateway))
    private readonly gateway: Gateway
  ) {}

  @EventPattern("chatEvent")
  incoming(@Payload() data: any) {
    this.gateway.sendToRoom(data.roomId, data);
  }
}
