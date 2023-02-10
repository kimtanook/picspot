import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from 'types/chat';
import { Server as ServerIO } from 'socket.io';
import { Server as HttpServer } from 'http';

const socket = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  console.log('New Socket.io server! ✅');

  const httpServer: HttpServer = res.socket.server as any;
  const io = new ServerIO(httpServer, {
    path: '/api/chat/socket',
  });

  io.on('connection', (socket) => {
    socket.on('enter_room', (room, user, toggleHandler) => {
      socket.join(room);
      toggleHandler();
      socket.to(room).emit('enter', user);
      socket.on('disconnecting', () => {
        socket.to(room).emit('exit', user);
      });
    });
    socket.on('message', (message) => {
      socket.to(message.room).emit('message', message);
    });
  });
  res.socket.server.io = io;
};

export default socket;
