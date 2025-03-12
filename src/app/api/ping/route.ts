import { NextRequest, NextResponse } from 'next/server';
import logger from '../utils/logger'; // Imports your existing logger

let pingInterval: NodeJS.Timeout | null = null;

// Initialize the ping service when this file is imported
if (process.env.NODE_ENV === 'production' && !pingInterval) {
  // Use environment variable if set, otherwise fall back to hardcoded URL
  const url = 'https://health-techy.onrender.com';
  const pingEndpoint = `${url}/api/ping`;

  // Set up interval to ping every 10 seconds
  pingInterval = setInterval(async () => {
    try {
      await fetch(pingEndpoint, {
        method: 'GET',
        headers: {
          'X-Keep-Alive': 'true', // Custom header to identify automatic pings
        },
      });
    } catch (error) {
      console.error('Error pinging:', error);
      // Silent fail - just for keeping the app alive
    }
  }, 10000);

  logger.info('Ping service started');
}

// The actual API endpoint that responds to pings
export async function GET(request: NextRequest) {
  const isKeepAlive = request.headers.get('X-Keep-Alive') === 'true';

  if (!isKeepAlive) {
    logger.info('Ping endpoint accessed manually');
  }
  console.log('Server pinged at   ', new Date().toISOString());
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
