import { MongoClient, ServerApiVersion, Db } from 'mongodb';

// Create a mock implementation for local development without MongoDB
const mockDb = {
  collection: () => ({
    insertOne: async () => ({ insertedId: 'mock-id-' + Date.now() }),
    findOne: async () => null,
    find: () => ({
      sort: () => ({
        toArray: async () => [],
      }),
    }),
    updateOne: async () => ({ 
      modifiedCount: 1,
      matchedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
      acknowledged: true
    }),
    deleteOne: async () => ({ 
      deletedCount: 1,
      acknowledged: true 
    }),
  }),
};

// Add type definitions to global for the MongoDB client
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// MongoDB Connection
let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;
let cachedDb: Db | typeof mockDb;

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'portfolio';

if (!uri) {
  console.log('MongoDB URI not found, using mock implementation');
  cachedDb = mockDb;
} else {
  try {
    // Use a singleton pattern for the MongoDB client
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      
      // Connect to the MongoDB client
      global._mongoClientPromise = client.connect();
      console.log('MongoDB connection initialized');
    }
    
    clientPromise = global._mongoClientPromise;
  } catch (error) {
    console.error('Error initializing MongoDB connection:', error);
    console.log('Using mock implementation instead');
    cachedDb = mockDb;
  }
}

// Function to get the MongoDB database
export async function getMongoDb(): Promise<Db | typeof mockDb> {
  if (cachedDb) {
    return cachedDb;
  }
  
  try {
    if (!clientPromise) {
      console.error('MongoDB client promise not initialized');
      return mockDb;
    }
    
    const client = await clientPromise;
    const db = client.db(dbName);
    cachedDb = db; // Cache the database connection
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.log('Falling back to mock implementation');
    return mockDb;
  }
}

// Helper function to format MongoDB documents (handles ObjectId conversion)
export function formatDocument(doc: any) {
  if (!doc) return null;
  
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
  };
}

// Helper function to format an array of documents
export function formatDocuments(docs: any[]) {
  return docs.map(formatDocument);
} 