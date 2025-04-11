import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class ChatService implements OnModuleInit {
  private client: ClientProxy;

  publish(data: any) {
    console.log("from srevice");
    return this.client.emit("chatEvent", data);
  }

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_URI],
        queue: 'chatqueue',
        queueOptions: { durable: false },
      },
    });
  }
}

