import { NextRequest, NextResponse } from 'next/server';
import { jobsService } from '@/lib/jobs-service';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GOOGLE-STYLE: Fetching saved jobs...')
    
    // Get saved jobs from the jobs service
    const savedJobs = jobsService.getSavedJobs();
    
    console.log('🚀 GOOGLE-STYLE: Saved jobs fetched:', savedJobs.length)
    
    return NextResponse.json({
      success: true,
      data: savedJobs,
      count: savedJobs.length
    });
  } catch (error) {
    console.error('🚀 GOOGLE-STYLE: Error fetching saved jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved jobs' },
      { status: 500 }
    );
  }
}
