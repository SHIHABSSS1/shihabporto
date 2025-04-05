# Shihab's Portfolio

A modern, responsive portfolio website built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Responsive design that works on all devices
- Dark mode toggle with persistent user preference
- Admin panel for content management
- MongoDB integration for data storage
- Contact form that sends messages to an admin dashboard
- Direct WhatsApp messaging link
- Interactive gallery with image zoom
- Project showcase with filtering capabilities

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Deployment**: Render (Web Service)

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account
- Git

### Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/SHIHABSSS1/shihabporto.git
   cd shihabporto
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=portfolio
   ADMIN_PASSWORD=your_admin_password
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables in the Render dashboard
5. Deploy the application

## Admin Access

Access the admin panel at `/admin` and use the password configured in your environment variables.

## License

MIT 