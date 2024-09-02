import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
      origin: 'http://localhost:5173', 
      methods: ['GET', 'POST'],        
      credentials: true                
    }
  })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  users: number = 0;

  handleConnection(client: Socket) {
    this.users++;
    this.server.emit('users', this.users);
  }

  handleDisconnect(client: Socket) {
    this.users--;
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { username: string, message: string }): void {
    this.server.emit('message', payload);
  }
}