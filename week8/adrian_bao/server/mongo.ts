import { MongoClient, ServerApiVersion, Collection } from 'mongodb';
import { ChatMessage } from './types';
import * as dotenv from 'dotenv';

dotenv.config();

export async function connectToMongoDB(): Promise<Collection<ChatMessage>> {
  const uri = process.env.MONGODB_URI as string;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await client.connect();
  const db = client.db('chat_app');
  return db.collection('messages');
}
