import { NextRequest, NextResponse } from 'next/server';
import { jobsService } from '@/lib/jobs-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    
    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_JOB_ID',
            message: 'Job ID is required'
          }
        },
        { status: 400 }
      );
    }

    // Check if job exists
    const job = jobsService.getJobById(jobId);
    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'JOB_NOT_FOUND',
            message: 'Job not found'
          }
        },
        { status: 404 }
      );
    }

    // Apply for job
    const success = await jobsService.applyForJob(jobId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Successfully applied for job',
        data: {
          jobId,
          applied: true
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'APPLICATION_FAILED',
            message: 'Failed to apply for job'
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('🚀 ENTERPRISE: Job application error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'APPLICATION_ERROR',
          message: 'An error occurred while applying for the job'
        }
      },
      { status: 500 }
    );
  }
}




