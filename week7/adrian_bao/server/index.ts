import * as dotenv from 'dotenv';
import * as express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import { Server } from 'socket.io';
import { MongoClient, ServerApiVersion, ObjectId as MongoObjectId } from 'mongodb';

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI as string
  const mongoDBClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await mongoDBClient.connect();
  const chatAppDB = mongoDBClient.db('chat_app');
  const messagesCollection = chatAppDB.collection('messages');

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: { origin: '*' }
  });

  app.use(express.static(join(__dirname, 'public')));

  io.on('connection', async (socket) => {
    socket.on('chat message', async (msg, clientOffset, callback) => {
      let result;
      try {
        const insertResult = await messagesCollection.insertOne({
          content: msg,
          client_offset: clientOffset,
        });
        result = insertResult;
      } catch (e) {
        if (e instanceof Error && (e as any).code === 11000) {
          callback();
        }
        return;
      }
      io.emit('chat message', msg, result.insertedId.toString());
      callback();
    });

    if (!socket.recovered) {
      const serverOffset = socket.handshake.auth.serverOffset;
      const query = serverOffset
        ? { _id: { $gt: new MongoObjectId(serverOffset) } }
        : {};

      const cursor = messagesCollection.find(query).sort({ _id: 1 });
      for await (const doc of cursor) {
        socket.emit('chat message', doc.content, doc._id.toString());
      }
    }
  });

  const port = 4000;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main();
