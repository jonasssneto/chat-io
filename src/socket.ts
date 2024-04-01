import { Server, Socket } from 'socket.io';

interface User {
    id: string;
    username: string;
    room: string;
}

interface Message {
    user: string;
    text: string;
    room: string;
}

const users: User[] = [];
const messages: Message[] = [];

export function sockets(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('New connection');

        socket.on('join', ({ username, room }) => {
            const user: User = { id: socket.id, username, room };

            const existingUser = users.find((user) => user.username === username);
            if (existingUser) user.username = `${username}_${users.filter((user) => user.username === username).length}`;
            
            users.push(user);
            socket.join(room);
        });

        socket.on('sendMessage', (message: Message) => {
            messages.push(message);
            io.to(message.room).emit('message', message);
        });
    });
}
