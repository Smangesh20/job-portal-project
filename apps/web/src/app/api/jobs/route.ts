import { NextRequest, NextResponse } from 'next/server';
import { jobsService } from '@/lib/jobs-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;
    const location = searchParams.get('location') || undefined;
    const type = searchParams.get('type')?.split(',') || undefined;
    const salaryMin = searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined;
    const salaryMax = searchParams.get('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined;
    const experienceLevel = searchParams.get('experienceLevel')?.split(',') || undefined;
    const company = searchParams.get('company') || undefined;
    const industry = searchParams.get('industry')?.split(',') || undefined;
    const isRemote = searchParams.get('isRemote') === 'true' ? true : undefined;
    const postedWithin = searchParams.get('postedWithin') ? parseInt(searchParams.get('postedWithin')!) : undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;

    const filters = {
      search,
      location,
      type,
      salaryMin,
      salaryMax,
      experienceLevel,
      company,
      industry,
      isRemote,
      postedWithin,
      tags
    };

    // Get jobs from service
    const result = await jobsService.searchJobs(filters);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('🚀 ENTERPRISE: Jobs API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'JOBS_FETCH_ERROR',
          message: 'Failed to fetch jobs'
        }
      },
      { status: 500 }
    );
  }
}



