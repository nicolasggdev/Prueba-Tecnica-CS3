import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(81, {
  cors: { origin: "*" }
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log("WebSocket Server On");
  }

  handleConnection(client: any, ...args: any[]) {
    console.log("Client Connected");
  }

  handleDisconnect(client: any) {
    console.log("Client Disconnected");
  }

  sendNotificationToClients(event: string, data: any) {
    this.server.emit(event, data);
  }
}
