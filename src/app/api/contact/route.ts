import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Use the same messages file path that the admin dashboard uses
const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Setup email data
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <p style="margin-bottom: 20px; color: #666;">You have received a new message from your portfolio contact form.</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">This email was sent from your portfolio website contact form.</p>
        </div>
      `,
    };
    
    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      
      // Try to save to file but don't fail if it doesn't work (for Vercel)
      try {
        saveMessageToFile(name, email, message);
      } catch (fileError) {
        console.error('File storage error:', fileError);
        // Continue without failing - this will happen in Vercel
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Your message has been sent successfully!' 
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Try to save the message to a fallback file but don't fail if it doesn't work
      try {
        saveMessageToFile(name, email, message);
      } catch (fileError) {
        console.error('File storage error:', fileError);
        // Continue without failing
      }
      
      return NextResponse.json({ 
        success: false, 
        error: 'Unable to send email notification. Please try again later.' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again later.' },
      { status: 500 }
    );
  }
}

// Helper function to save messages to a file - now using the same file format as admin dashboard
function saveMessageToFile(name: string, email: string, message: string) {
  // Guard against serverless environment (Vercel)
  /* Vercel check removed */ {

  // Create directory if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // Initialize the file with an empty array if it doesn't exist
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
  }
  
  // Read existing messages
  let existingData = [];
  try {
    const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf8');
    existingData = JSON.parse(fileContent);
    if (!Array.isArray(existingData)) {
      existingData = [];
    }
  } catch (error) {
    console.error('Error reading messages file:', error);
    existingData = [];
  }
  
  // Add new message in the same format that the admin dashboard expects
  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  existingData.push(newMessage);
  
  // Write updated data back to file
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existingData, null, 2));
} 