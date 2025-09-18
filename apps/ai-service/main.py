#!/usr/bin/env python3
"""
🌍 ASK YA CHAM - QUANTUM AI SERVICE
World's Most Advanced AI-Powered Job Matching Service
"""

import asyncio
import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
import json
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our quantum engines
from quantum_research import QuantumResearchEngine
from quantum_matching import QuantumMatchingEngine, QuantumBiasElimination
from quantum_analytics import QuantumAnalyticsEngine, MarketIntelligenceEngine
from global_data_sync import GlobalDataSyncEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Ask Ya Cham - Quantum AI Service",
    description="World's Most Advanced AI-Powered Job Matching Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize quantum engines
quantum_research_engine = QuantumResearchEngine()
quantum_matching_engine = QuantumMatchingEngine()
quantum_bias_elimination = QuantumBiasElimination()
quantum_analytics_engine = QuantumAnalyticsEngine()
market_intelligence_engine = MarketIntelligenceEngine()
global_data_sync_engine = GlobalDataSyncEngine()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🌍 Ask Ya Cham - Quantum AI Service",
        "version": "1.0.0",
        "status": "active",
        "features": [
            "Quantum Research Engine",
            "Quantum Matching Engine", 
            "Quantum Analytics Engine",
            "Global Data Synchronization",
            "Bias Elimination System",
            "Market Intelligence"
        ],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "quantum-ai-service",
        "timestamp": datetime.now().isoformat(),
        "quantum_state": "superposition",
        "engines": {
            "research": "active",
            "matching": "active", 
            "analytics": "active",
            "data_sync": "active",
            "bias_elimination": "active"
        }
    }

@app.post("/api/quantum/research")
async def conduct_quantum_research(request: Dict[str, Any]):
    """
    Conduct quantum-powered research on job market
    """
    try:
        query = request.get("query", "")
        research_type = request.get("type", "comprehensive")
        
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
        
        # Conduct quantum research
        research_result = await quantum_research_engine.conduct_quantum_research(query, research_type)
        
        return {
            "success": True,
            "data": {
                "id": research_result.query,
                "query": research_result.query,
                "timestamp": research_result.timestamp.isoformat(),
                "results": {
                    "total_jobs": research_result.total_jobs,
                    "average_salary": research_result.average_salary,
                    "growth_rate": research_result.growth_rate,
                    "market_size": research_result.market_size
                },
                "top_companies": research_result.top_companies,
                "top_skills": research_result.top_skills,
                "trending_technologies": research_result.trending_technologies,
                "market_insights": research_result.market_insights,
                "recommendations": research_result.recommendations,
                "salary_breakdown": research_result.salary_breakdown,
                "skill_demand": research_result.skill_demand,
                "location_analysis": research_result.location_analysis,
                "industry_trends": research_result.industry_trends,
                "quantum_score": research_result.quantum_score
            }
        }
        
    except Exception as e:
        logger.error(f"Error in quantum research: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Quantum research failed: {str(e)}")

@app.post("/api/quantum/matching")
async def find_quantum_matches(request: Dict[str, Any]):
    """
    Find quantum-powered job matches
    """
    try:
        candidate_data = request.get("candidate", {})
        job_data = request.get("jobs", [])
        top_k = request.get("top_k", 10)
        
        if not candidate_data or not job_data:
            raise HTTPException(status_code=400, detail="Candidate and jobs data are required")
        
        # Convert to candidate and job objects
        from quantum_matching import Candidate, Job
        
        candidate = Candidate(
            id=candidate_data.get("id", ""),
            name=candidate_data.get("name", ""),
            email=candidate_data.get("email", ""),
            skills=candidate_data.get("skills", []),
            experience=candidate_data.get("experience", 0),
            education=candidate_data.get("education", ""),
            location=candidate_data.get("location", ""),
            salary_expectation=candidate_data.get("salary_expectation", 0),
            job_preferences=candidate_data.get("job_preferences", []),
            personality_traits=candidate_data.get("personality_traits", {}),
            cultural_values=candidate_data.get("cultural_values", {}),
            work_style=candidate_data.get("work_style", {}),
            career_goals=candidate_data.get("career_goals", []),
            availability=candidate_data.get("availability", ""),
            remote_preference=candidate_data.get("remote_preference", False),
            travel_willingness=candidate_data.get("travel_willingness", False),
            quantum_profile=candidate_data.get("quantum_profile", {})
        )
        
        jobs = []
        for job_item in job_data:
            job = Job(
                id=job_item.get("id", ""),
                title=job_item.get("title", ""),
                company=job_item.get("company", ""),
                description=job_item.get("description", ""),
                requirements=job_item.get("requirements", []),
                skills_required=job_item.get("skills_required", []),
                experience_required=job_item.get("experience_required", 0),
                location=job_item.get("location", ""),
                salary_range=tuple(job_item.get("salary_range", [0, 0])),
                job_type=job_item.get("job_type", ""),
                company_culture=job_item.get("company_culture", {}),
                team_dynamics=job_item.get("team_dynamics", {}),
                growth_opportunities=job_item.get("growth_opportunities", []),
                benefits=job_item.get("benefits", []),
                remote_friendly=job_item.get("remote_friendly", False),
                travel_required=job_item.get("travel_required", False),
                quantum_requirements=job_item.get("quantum_requirements", {})
            )
            jobs.append(job)
        
        # Find quantum matches
        matches = await quantum_matching_engine.find_quantum_matches(candidate, jobs, top_k)
        
        # Apply bias elimination
        matches = await quantum_bias_elimination.eliminate_bias(matches)
        
        # Convert matches to response format
        matches_data = []
        for match in matches:
            matches_data.append({
                "candidate_id": match.candidate_id,
                "job_id": match.job_id,
                "overall_score": match.overall_score,
                "skill_match": match.skill_match,
                "experience_match": match.experience_match,
                "cultural_fit": match.cultural_fit,
                "location_match": match.location_match,
                "salary_match": match.salary_match,
                "growth_potential": match.growth_potential,
                "quantum_compatibility": match.quantum_compatibility,
                "match_reasons": match.match_reasons,
                "improvement_suggestions": match.improvement_suggestions,
                "confidence_level": match.confidence_level
            })
        
        return {
            "success": True,
            "data": {
                "matches": matches_data,
                "total_matches": len(matches_data),
                "quantum_enhancement": True,
                "bias_elimination": True
            }
        }
        
    except Exception as e:
        logger.error(f"Error in quantum matching: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Quantum matching failed: {str(e)}")

@app.post("/api/quantum/analytics")
async def generate_quantum_analytics(request: Dict[str, Any]):
    """
    Generate quantum-powered analytics
    """
    try:
        data = request.get("data", {})
        
        # Generate real-time analytics
        analytics = await quantum_analytics_engine.generate_real_time_analytics(data)
        
        return {
            "success": True,
            "data": analytics
        }
        
    except Exception as e:
        logger.error(f"Error in quantum analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Quantum analytics failed: {str(e)}")

@app.get("/api/market/intelligence/{sector}")
async def get_market_intelligence(sector: str):
    """
    Get market intelligence for a specific sector
    """
    try:
        # Generate market intelligence
        intelligence = await market_intelligence_engine.generate_market_intelligence(sector)
        
        return {
            "success": True,
            "data": {
                "sector": intelligence.sector,
                "timestamp": intelligence.timestamp.isoformat(),
                "total_jobs": intelligence.total_jobs,
                "average_salary": intelligence.average_salary,
                "growth_rate": intelligence.growth_rate,
                "competition_index": intelligence.competition_index,
                "remote_percentage": intelligence.remote_percentage,
                "skill_demand": intelligence.skill_demand,
                "location_distribution": intelligence.location_distribution,
                "company_distribution": intelligence.company_distribution,
                "salary_distribution": intelligence.salary_distribution,
                "trend_analysis": intelligence.trend_analysis,
                "quantum_insights": intelligence.quantum_insights
            }
        }
        
    except Exception as e:
        logger.error(f"Error in market intelligence: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Market intelligence failed: {str(e)}")

@app.post("/api/global/sync")
async def sync_global_data(background_tasks: BackgroundTasks):
    """
    Synchronize global job data from all sources
    """
    try:
        # Run sync in background
        background_tasks.add_task(global_data_sync_engine.sync_global_data)
        
        return {
            "success": True,
            "message": "Global data synchronization started",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in global data sync: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Global data sync failed: {str(e)}")

@app.get("/api/global/sync/status")
async def get_sync_status():
    """
    Get global data synchronization status
    """
    try:
        # This would check actual sync status from Redis or database
        return {
            "success": True,
            "data": {
                "status": "running",
                "last_sync": datetime.now().isoformat(),
                "total_sources": 15,
                "active_sources": 12,
                "jobs_synced_today": 50000,
                "quantum_enhancement": True
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting sync status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get sync status: {str(e)}")

@app.post("/api/quantum/bias/eliminate")
async def eliminate_bias(request: Dict[str, Any]):
    """
    Apply quantum bias elimination to matches
    """
    try:
        matches_data = request.get("matches", [])
        
        # Convert to match objects
        from quantum_matching import MatchResult
        
        matches = []
        for match_data in matches_data:
            match = MatchResult(
                candidate_id=match_data.get("candidate_id", ""),
                job_id=match_data.get("job_id", ""),
                overall_score=match_data.get("overall_score", 0.0),
                skill_match=match_data.get("skill_match", 0.0),
                experience_match=match_data.get("experience_match", 0.0),
                cultural_fit=match_data.get("cultural_fit", 0.0),
                location_match=match_data.get("location_match", 0.0),
                salary_match=match_data.get("salary_match", 0.0),
                growth_potential=match_data.get("growth_potential", 0.0),
                quantum_compatibility=match_data.get("quantum_compatibility", 0.0),
                match_reasons=match_data.get("match_reasons", []),
                improvement_suggestions=match_data.get("improvement_suggestions", []),
                confidence_level=match_data.get("confidence_level", 0.0)
            )
            matches.append(match)
        
        # Apply bias elimination
        bias_eliminated_matches = await quantum_bias_elimination.eliminate_bias(matches)
        
        # Convert back to response format
        result_matches = []
        for match in bias_eliminated_matches:
            result_matches.append({
                "candidate_id": match.candidate_id,
                "job_id": match.job_id,
                "overall_score": match.overall_score,
                "skill_match": match.skill_match,
                "experience_match": match.experience_match,
                "cultural_fit": match.cultural_fit,
                "location_match": match.location_match,
                "salary_match": match.salary_match,
                "growth_potential": match.growth_potential,
                "quantum_compatibility": match.quantum_compatibility,
                "match_reasons": match.match_reasons,
                "improvement_suggestions": match.improvement_suggestions,
                "confidence_level": match.confidence_level
            })
        
        return {
            "success": True,
            "data": {
                "matches": result_matches,
                "bias_elimination_applied": True,
                "quantum_enhancement": True
            }
        }
        
    except Exception as e:
        logger.error(f"Error in bias elimination: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Bias elimination failed: {str(e)}")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An internal server error occurred",
                "timestamp": datetime.now().isoformat()
            }
        }
    )

if __name__ == "__main__":
    print("🌍 Starting Ask Ya Cham - Quantum AI Service...")
    print("🔬 Quantum Research Engine: ACTIVE")
    print("🤖 Quantum Matching Engine: ACTIVE")
    print("📊 Quantum Analytics Engine: ACTIVE")
    print("🌍 Global Data Sync: ACTIVE")
    print("🛡️ Bias Elimination: ACTIVE")
    print("")
    print("🚀 Server starting on http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 ReDoc Documentation: http://localhost:8000/redoc")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

