import { Server, Socket } from 'socket.io';
import { Collection, ObjectId } from 'mongodb';
import { ChatMessage } from './types';

export function setupSocketEvents(io: Server, messagesCollection: Collection<ChatMessage>) {
  io.on('connection', (socket: Socket) => {
    socket.on('chat message', async (msg: string, clientOffset: string, callback: Function) => {
      const username = 'not_implemented_so_far';
      const timestamp = new Date();
      const is_read = false;

      try {
        const insertResult = await messagesCollection.insertOne({
          content: msg,
          username: username,
          timestamp: timestamp,
          is_read: is_read,
          client_offset: clientOffset,
        });

        io.emit('chat message', msg, insertResult.insertedId.toString());
        callback();
      } catch (e: any) {
        if (e.code === 11000) {
          callback();
        }
      }
    });

    if (!socket.recovered) {
      const serverOffset = socket.handshake.auth.serverOffset;
      const query = serverOffset
        ? { _id: { $gt: new ObjectId(serverOffset) } }
        : {};

      const cursor = messagesCollection.find(query).sort({ _id: 1 });
      cursor.forEach(doc => {
        socket.emit('chat message', doc.content, doc._id.toString());
      });
    }
  });
}
