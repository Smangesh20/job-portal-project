import { NextRequest, NextResponse } from 'next/server';
import { jobsService } from '@/lib/jobs-service';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GOOGLE-STYLE: Fetching recommended jobs...')
    
    // Get recommended jobs from the jobs service
    const recommendedJobs = jobsService.getRecommendedJobs();
    
    console.log('🚀 GOOGLE-STYLE: Recommended jobs fetched:', recommendedJobs.length)
    
    return NextResponse.json({
      success: true,
      data: recommendedJobs,
      count: recommendedJobs.length
    });
  } catch (error) {
    console.error('🚀 GOOGLE-STYLE: Error fetching recommended jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommended jobs' },
      { status: 500 }
    );
  }
}






















