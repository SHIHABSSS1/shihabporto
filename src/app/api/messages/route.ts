import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb, formatDocument, formatDocuments } from '@/lib/mongodb';

// Helper function to add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/messages - Received request');
    
    // Get message data from request
    const { name, message } = await req.json();
    console.log('Message data:', { name, messageLength: message?.length || 0 });
    
    if (!name || !message) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400, headers: corsHeaders() }
      );
    }
    
    // Create message object
    const newMessage = {
      name,
      message,
      timestamp: new Date(),
      read: false,
    };
    
    console.log('Attempting to add to MongoDB...');
    
    try {
      // Add message to MongoDB
      const db = await getMongoDb();
      const messagesCollection = db.collection('messages');
      const result = await messagesCollection.insertOne(newMessage);
      
      console.log('Message added to MongoDB, ID:', result.insertedId);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Message saved successfully',
        id: result.insertedId.toString()
      }, { headers: corsHeaders() });
    } catch (dbError) {
      console.error('MongoDB error:', dbError);
      return NextResponse.json(
        { error: 'Database error, but your message was received. We will look into this issue.', details: String(dbError) },
        { status: 500, headers: corsHeaders() }
      );
    }
  } catch (error) {
    console.error('Error in message API:', error);
    return NextResponse.json(
      { error: 'Failed to process your message', details: String(error) },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function GET() {
  try {
    console.log('GET /api/messages - Received request');
    
    try {
      // Get messages from MongoDB, ordered by timestamp descending (newest first)
      const db = await getMongoDb();
      const messagesCollection = db.collection('messages');
      
      console.log('Querying MongoDB...');
      
      const messagesDocs = await messagesCollection
        .find({})
        .sort({ timestamp: -1 })
        .toArray();
      
      console.log('Query complete, document count:', messagesDocs.length);
      
      // Format the documents to handle ObjectId conversion
      const messages = formatDocuments(messagesDocs);
      
      return NextResponse.json({ messages }, { headers: corsHeaders() });
    } catch (dbError) {
      console.error('MongoDB query error:', dbError);
      // Return empty messages with a note
      return NextResponse.json({ 
        messages: [],
        note: 'Could not fetch messages due to a database error'
      }, { headers: corsHeaders() });
    }
  } catch (error) {
    console.error('Error in GET messages API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: String(error) },
      { status: 500, headers: corsHeaders() }
    );
  }
} 