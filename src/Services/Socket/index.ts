import { Server, Socket } from "socket.io";
import { Message, User } from "./type";

export class Sockets {
  private users: User[] = [];
  private messages: Message[] = [];

  constructor(private io: Server) {}

  public connect() {
    this.io.on("connection", (socket: Socket) => {
      console.log("New connection");

      this.join(this.io, socket);
      this.sendMessage(this.io, socket);

    });
  }

  private join(io: Server, socket: Socket) {
    socket.on("join", ({ username, room }) => {
      const user: User = { id: socket.id, username, room };

      const existingUser = this.users.find(
        (user) => user.username === username
      );
      if (existingUser)
        user.username = `${username}_${
          this.users.filter((user) => user.username === username).length
        }`;

      this.users.push(user);
      socket.join(room);
    });
  }

  private sendMessage(io: Server, socket: Socket) {
    socket.on("sendMessage", (message: Message) => {
      this.messages.push(message);
      io.to(message.room).emit("message", message);
    });
  }
}
