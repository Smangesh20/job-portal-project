/**
 * Enterprise Server-Sent Events (SSE) Endpoint
 * Google-style real-time data streaming fallback
 */

import { NextRequest } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Store for active SSE connections
const sseConnections = new Set<ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Add connection to active set
      sseConnections.add(controller);
      
      // Send initial connection message
      const initialMessage = {
        type: 'connection',
        data: { status: 'connected', timestamp: Date.now() },
        timestamp: Date.now(),
        id: `sse_${Date.now()}`
      };
      
      controller.enqueue(`data: ${JSON.stringify(initialMessage)}\n\n`);
      
      // Send periodic heartbeat
      const heartbeatInterval = setInterval(() => {
        if (sseConnections.has(controller)) {
          const heartbeatMessage = {
            type: 'heartbeat',
            data: { timestamp: Date.now() },
            timestamp: Date.now(),
            id: `heartbeat_${Date.now()}`
          };
          
          try {
            controller.enqueue(`data: ${JSON.stringify(heartbeatMessage)}\n\n`);
          } catch (error) {
            // Connection closed, remove from set
            sseConnections.delete(controller);
            clearInterval(heartbeatInterval);
          }
        } else {
          clearInterval(heartbeatInterval);
        }
      }, 30000); // 30 seconds
      
      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        sseConnections.delete(controller);
        clearInterval(heartbeatInterval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}

// Broadcast message to all SSE connections (internal function)
function broadcastSSEMessage(type: string, data: any) {
  const message = {
    type,
    data,
    timestamp: Date.now(),
    id: `${type}_${Date.now()}`
  };

  const deadConnections = new Set<ReadableStreamDefaultController>();
  
  sseConnections.forEach((controller) => {
    try {
      controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
    } catch (error) {
      // Connection is dead, mark for removal
      deadConnections.add(controller);
    }
  });
  
  // Remove dead connections
  deadConnections.forEach(controller => sseConnections.delete(controller));
}

// Get SSE connection count (internal function)
function getSSEConnectionCount() {
  return sseConnections.size;
}
