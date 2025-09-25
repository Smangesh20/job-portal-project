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

    // Save job
    const success = await jobsService.saveJob(jobId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Job saved successfully',
        data: {
          jobId,
          saved: job.saved
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SAVE_FAILED',
            message: 'Failed to save job'
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('🚀 ENTERPRISE: Job save error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SAVE_ERROR',
          message: 'An error occurred while saving the job'
        }
      },
      { status: 500 }
    );
  }
}











