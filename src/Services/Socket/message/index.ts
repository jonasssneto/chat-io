import { prisma } from "../../prisma";
import { Message } from "../type";

export class MessageServices {
  public static async save(data: Message) {
    const message = await prisma.message.create({
      data,
    });
    return message;
  }

  public static async getByRoom(room: string) {
    const messages = await prisma.message.findMany({
      where: {
        room,
      },
    });
    return messages;
  }
}
