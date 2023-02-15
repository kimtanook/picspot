import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/socket';
import { Server as ServerIO } from 'socket.io';
import { Server as HttpServer } from 'http';

const socket = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  console.log('New Socket.io server! ✅');

  const httpServer: HttpServer = res.socket.server as any;
  const io = new ServerIO(httpServer, {
    path: '/api/chat/socket',
  });

  const chatRooms = () => {
    const {
      sockets: {
        adapter: { sids, rooms },
      },
    } = io;
    const publicRooms: RoomsType[] = [];
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        publicRooms.push({ room: key });
      }
    });

    return publicRooms;
  };

  io.on('connection', (socket) => {
    io.sockets.emit('roomChange', chatRooms());
    socket.on('enterRoom', (room, user, id, toggleHandler) => {
      socket.join(room);
      toggleHandler();
      socket.to(room).emit('enter', user);
      io.sockets.emit('roomChange', chatRooms());
      socket.on('disconnecting', () => {
        socket.to(room).emit('exit', user);
      });
      socket.on('disconnect', () => {
        io.sockets.emit('roomChange', chatRooms());
      });
    });
    socket.on('message', (message) => {
      socket.to(message.room).emit('message', message);
    });
    socket.on('whisperMessage', (whisperId, whisperMessage) => {
      socket.to(whisperId).emit('message', whisperMessage);
    });
  });
  res.socket.server.io = io;
};

export default socket;
