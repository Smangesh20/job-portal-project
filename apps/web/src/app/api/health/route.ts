import { NextRequest, NextResponse } from 'next/server'

// Google-style health check endpoint
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Basic health checks
    const healthChecks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: await checkDatabase(),
        memory: checkMemory(),
        disk: checkDisk(),
        network: checkNetwork()
      }
    }

    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      ...healthChecks,
      responseTime: `${responseTime}ms`,
      status: responseTime < 1000 ? 'healthy' : 'degraded'
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      checks: {
        database: 'unknown',
        memory: 'unknown',
        disk: 'unknown',
        network: 'unknown'
      }
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

// Database health check
async function checkDatabase(): Promise<string> {
  try {
    // Simulate database check
    // In a real app, you'd check your actual database connection
    await new Promise(resolve => setTimeout(resolve, 10))
    return 'healthy'
  } catch (error) {
    return 'unhealthy'
  }
}

// Memory health check
function checkMemory(): string {
  try {
    const memUsage = process.memoryUsage()
    const memUsageMB = memUsage.heapUsed / 1024 / 1024
    
    // Consider unhealthy if using more than 500MB
    if (memUsageMB > 500) {
      return 'degraded'
    }
    
    return 'healthy'
  } catch (error) {
    return 'unknown'
  }
}

// Disk health check
function checkDisk(): string {
  try {
    // In a real app, you'd check disk space
    // For now, just return healthy
    return 'healthy'
  } catch (error) {
    return 'unknown'
  }
}

// Network health check
function checkNetwork(): string {
  try {
    // In a real app, you'd check external service connectivity
    // For now, just return healthy
    return 'healthy'
  } catch (error) {
    return 'unknown'
  }
}