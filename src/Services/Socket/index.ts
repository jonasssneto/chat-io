import { Server, Socket } from "socket.io";
import { MessageServices } from "./message";
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
      this.loadPreviousMessages(this.io, socket);
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

      io.to(room).emit("users", this.users);
    });
  }

  private sendMessage(io: Server, socket: Socket) {
    socket.on("sendMessage", async (message: Message) => {
      this.messages.push(message);
      await MessageServices.save(message);
      io.to(message.room).emit("message", message);
    });
  }

  private loadPreviousMessages(io: Server, socket: Socket) {
    socket.on("loadPreviousMessages", async (room: string) => {
      const messages = await MessageServices.getByRoom(room);
      io.to(room).emit("previousMessages", messages);
    });
  }
}
