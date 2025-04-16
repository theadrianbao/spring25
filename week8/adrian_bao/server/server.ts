import * as express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import { Server } from 'socket.io';
import { connectToMongoDB } from './mongo';
import { setupSocketEvents } from './socketHandler';

async function main() {
  const messagesCollection = await connectToMongoDB();

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: { origin: '*' },
  });

  app.use(express.static(join(__dirname, '../public')));
  setupSocketEvents(io, messagesCollection);

  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

main();
