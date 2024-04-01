import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Sockets } from './Services/Socket';

const app: Application = express();
const server: http.Server = http.createServer(app);

app.use(cors());
app.use(express.static('public'));
const io: Server = new Server(server);

const sockets = new Sockets(io);
sockets.connect();


server.listen(3000, () => console.log(`Server is running on port 3000`));
