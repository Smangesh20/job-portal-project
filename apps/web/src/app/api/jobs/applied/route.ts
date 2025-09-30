import { NextRequest, NextResponse } from 'next/server';
import { jobsService } from '@/lib/jobs-service';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GOOGLE-STYLE: Fetching applied jobs...')
    
    // Get applied jobs from the jobs service
    const appliedJobs = jobsService.getAppliedJobs();
    
    console.log('🚀 GOOGLE-STYLE: Applied jobs fetched:', appliedJobs.length)
    
    return NextResponse.json({
      success: true,
      data: appliedJobs,
      count: appliedJobs.length
    });
  } catch (error) {
    console.error('🚀 GOOGLE-STYLE: Error fetching applied jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applied jobs' },
      { status: 500 }
    );
  }
}

















