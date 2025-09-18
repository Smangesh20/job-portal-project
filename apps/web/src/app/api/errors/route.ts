import { NextRequest, NextResponse } from 'next/server'

interface ErrorReport {
  id: string
  timestamp: number
  type: string
  message: string
  stack?: string
  context?: any
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
  userAgent?: string
  url?: string
  userId?: string
}

// In-memory error storage (in production, use a database)
const errorReports: ErrorReport[] = []

export async function POST(request: NextRequest) {
  try {
    const errorData: Partial<ErrorReport> = await request.json()
    
    // Validate required fields
    if (!errorData.id || !errorData.message || !errorData.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Add additional context
    const errorReport: ErrorReport = {
      id: errorData.id,
      timestamp: errorData.timestamp || Date.now(),
      type: errorData.type,
      message: errorData.message,
      stack: errorData.stack,
      context: errorData.context,
      severity: errorData.severity || 'medium',
      resolved: false,
      userAgent: request.headers.get('user-agent') || undefined,
      url: request.headers.get('referer') || undefined,
      userId: errorData.userId
    }

    // Store error report
    errorReports.push(errorReport)

    // In production, you would:
    // 1. Store in database
    // 2. Send to error tracking service (Sentry, Bugsnag, etc.)
    // 3. Send alerts for critical errors
    // 4. Log to monitoring system

    // Simulate error processing
    if (errorReport.severity === 'critical') {
      // Send alert for critical errors
      }

    return NextResponse.json(
      { success: true, message: 'Error reported successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get('severity')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '100')

    let filteredErrors = errorReports

    // Filter by severity
    if (severity) {
      filteredErrors = filteredErrors.filter(error => error.severity === severity)
    }

    // Filter by type
    if (type) {
      filteredErrors = filteredErrors.filter(error => error.type === type)
    }

    // Limit results
    filteredErrors = filteredErrors.slice(-limit)

    // Calculate statistics
    const stats = {
      total: errorReports.length,
      byType: errorReports.reduce((acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      bySeverity: errorReports.reduce((acc, error) => {
        acc[error.severity] = (acc[error.severity] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      unresolved: errorReports.filter(error => !error.resolved).length
    }

    return NextResponse.json({
      errors: filteredErrors,
      stats
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch error reports' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { errorId, resolved } = await request.json()
    
    if (!errorId || typeof resolved !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const errorIndex = errorReports.findIndex(error => error.id === errorId)
    if (errorIndex === -1) {
      return NextResponse.json(
        { error: 'Error not found' },
        { status: 404 }
      )
    }

    errorReports[errorIndex].resolved = resolved

    return NextResponse.json({
      success: true,
      message: 'Error status updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update error status' },
      { status: 500 }
    )
  }
}
