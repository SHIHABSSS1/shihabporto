import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb, formatDocument } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PATCH /api/messages/[id] - Received request');
    
    if (!params.id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400, headers: corsHeaders() }
      );
    }
    
    // Get message data from request
    const { read } = await req.json();
    
    if (read === undefined) {
      return NextResponse.json(
        { error: 'Read status is required' },
        { status: 400, headers: corsHeaders() }
      );
    }
    
    try {
      const db = await getMongoDb();
      const messagesCollection = db.collection('messages');
      
      // Convert string ID to MongoDB ObjectId
      let messageId;
      try {
        messageId = new ObjectId(params.id);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid message ID format' },
          { status: 400, headers: corsHeaders() }
        );
      }
      
      // Update the message
      const result = await messagesCollection.updateOne(
        { _id: messageId },
        { $set: { read, updatedAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404, headers: corsHeaders() }
        );
      }
      
      // Get the updated message
      const updatedMessage = await messagesCollection.findOne({ _id: messageId });
      
      return NextResponse.json(
        { 
          message: formatDocument(updatedMessage),
          success: true 
        }, 
        { headers: corsHeaders() }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: String(dbError) },
        { status: 500, headers: corsHeaders() }
      );
    }
  } catch (error) {
    console.error('Error in PATCH message API:', error);
    return NextResponse.json(
      { error: 'Failed to update message', details: String(error) },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE /api/messages/[id] - Received request');
    
    if (!params.id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400, headers: corsHeaders() }
      );
    }
    
    try {
      const db = await getMongoDb();
      const messagesCollection = db.collection('messages');
      
      // Convert string ID to MongoDB ObjectId
      let messageId;
      try {
        messageId = new ObjectId(params.id);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid message ID format' },
          { status: 400, headers: corsHeaders() }
        );
      }
      
      // Delete the message
      const result = await messagesCollection.deleteOne({ _id: messageId });
      
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404, headers: corsHeaders() }
        );
      }
      
      return NextResponse.json(
        { success: true, message: 'Message deleted successfully' },
        { headers: corsHeaders() }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: String(dbError) },
        { status: 500, headers: corsHeaders() }
      );
    }
  } catch (error) {
    console.error('Error in DELETE message API:', error);
    return NextResponse.json(
      { error: 'Failed to delete message', details: String(error) },
      { status: 500, headers: corsHeaders() }
    );
  }
} 