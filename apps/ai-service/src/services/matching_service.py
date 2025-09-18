"""
Advanced AI Matching Service
Implements sophisticated matching algorithms for job seekers and employers
"""

import asyncio
import logging
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime

import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
import joblib

from src.config import settings, MODEL_PATHS
from src.models.matching_models import (
    SkillMatchingModel,
    CulturalFitModel,
    SalaryPredictionModel,
    JobClassificationModel
)
from src.utils.text_processing import TextProcessor
from src.utils.embeddings import EmbeddingService

logger = logging.getLogger(__name__)


@dataclass
class MatchingResult:
    """Result of a matching operation"""
    job_seeker_id: str
    job_id: str
    overall_score: float
    skill_match_score: float
    experience_match_score: float
    cultural_fit_score: float
    location_match_score: float
    salary_match_score: float
    diversity_score: float
    reasoning: List[str]
    recommendations: List[str]
    risk_factors: List[str]
    confidence: float
    timestamp: datetime


class MatchingService:
    """Advanced AI matching service"""
    
    def __init__(self):
        self.skill_model = None
        self.cultural_fit_model = None
        self.salary_model = None
        self.job_classifier = None
        self.text_processor = TextProcessor()
        self.embedding_service = EmbeddingService()
        self.tfidf_vectorizer = TfidfVectorizer(max_features=10000, stop_words='english')
        self.scaler = StandardScaler()
        self.is_loaded = False
        
    async def load_models(self):
        """Load all AI models"""
        try:
            logger.info("Loading matching models...")
            
            # Load skill matching model
            self.skill_model = SkillMatchingModel()
            await self.skill_model.load_model()
            
            # Load cultural fit model
            self.cultural_fit_model = CulturalFitModel()
            await self.cultural_fit_model.load_model()
            
            # Load salary prediction model
            self.salary_model = SalaryPredictionModel()
            await self.salary_model.load_model()
            
            # Load job classification model
            self.job_classifier = JobClassificationModel()
            await self.job_classifier.load_model()
            
            # Load embedding service
            await self.embedding_service.initialize()
            
            self.is_loaded = True
            logger.info("All matching models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading matching models: {e}")
            raise
    
    async def find_matches(
        self,
        job_id: str,
        candidate_ids: Optional[List[str]] = None,
        limit: int = 50,
        weights: Optional[Dict[str, float]] = None,
        diversity_boost: bool = False
    ) -> List[MatchingResult]:
        """Find best matches for a job posting"""
        
        if not self.is_loaded:
            raise RuntimeError("Models not loaded")
        
        logger.info(f"Finding matches for job {job_id}")
        
        # Get job data
        job_data = await self._get_job_data(job_id)
        if not job_data:
            raise ValueError(f"Job {job_id} not found")
        
        # Get candidate data
        if candidate_ids:
            candidates = await self._get_candidates_by_ids(candidate_ids)
        else:
            candidates = await self._get_relevant_candidates(job_data)
        
        if not candidates:
            return []
        
        # Calculate matches
        matches = []
        for candidate in candidates:
            try:
                match_result = await self._calculate_match(job_data, candidate, weights, diversity_boost)
                matches.append(match_result)
            except Exception as e:
                logger.error(f"Error calculating match for candidate {candidate['id']}: {e}")
                continue
        
        # Sort by overall score and return top matches
        matches.sort(key=lambda x: x.overall_score, reverse=True)
        return matches[:limit]
    
    async def _calculate_match(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any],
        weights: Optional[Dict[str, float]] = None,
        diversity_boost: bool = False
    ) -> MatchingResult:
        """Calculate comprehensive match between job and candidate"""
        
        if weights is None:
            weights = settings.MATCHING_WEIGHTS
        
        # Calculate individual scores
        skill_score = await self._calculate_skill_match(job_data, candidate_data)
        experience_score = await self._calculate_experience_match(job_data, candidate_data)
        cultural_score = await self._calculate_cultural_fit(job_data, candidate_data)
        location_score = await self._calculate_location_match(job_data, candidate_data)
        salary_score = await self._calculate_salary_match(job_data, candidate_data)
        diversity_score = await self._calculate_diversity_score(job_data, candidate_data)
        
        # Apply diversity boost if enabled
        if diversity_boost and diversity_score > 0.7:
            overall_score = (
                weights["skills"] * skill_score +
                weights["experience"] * experience_score +
                weights["cultural_fit"] * cultural_score +
                weights["location"] * location_score +
                weights["salary"] * salary_score +
                0.1 * diversity_score  # Additional diversity boost
            )
        else:
            overall_score = (
                weights["skills"] * skill_score +
                weights["experience"] * experience_score +
                weights["cultural_fit"] * cultural_score +
                weights["location"] * location_score +
                weights["salary"] * salary_score
            )
        
        # Generate reasoning and recommendations
        reasoning = self._generate_reasoning(
            skill_score, experience_score, cultural_score, 
            location_score, salary_score, diversity_score
        )
        
        recommendations = self._generate_recommendations(
            job_data, candidate_data, skill_score, experience_score
        )
        
        risk_factors = self._identify_risk_factors(
            job_data, candidate_data, overall_score
        )
        
        # Calculate confidence based on data completeness
        confidence = self._calculate_confidence(job_data, candidate_data)
        
        return MatchingResult(
            job_seeker_id=candidate_data["id"],
            job_id=job_data["id"],
            overall_score=round(overall_score, 3),
            skill_match_score=round(skill_score, 3),
            experience_match_score=round(experience_score, 3),
            cultural_fit_score=round(cultural_score, 3),
            location_match_score=round(location_score, 3),
            salary_match_score=round(salary_score, 3),
            diversity_score=round(diversity_score, 3),
            reasoning=reasoning,
            recommendations=recommendations,
            risk_factors=risk_factors,
            confidence=round(confidence, 3),
            timestamp=datetime.now()
        )
    
    async def _calculate_skill_match(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> float:
        """Calculate skill matching score"""
        
        job_skills = job_data.get("skills", [])
        candidate_skills = candidate_data.get("skills", [])
        
        if not job_skills or not candidate_skills:
            return 0.0
        
        # Use skill matching model
        skill_score = await self.skill_model.predict(job_skills, candidate_skills)
        
        # Additional semantic matching
        job_skill_text = " ".join([skill["name"] for skill in job_skills])
        candidate_skill_text = " ".join([skill["name"] for skill in candidate_skills])
        
        job_embedding = await self.embedding_service.get_embedding(job_skill_text)
        candidate_embedding = await self.embedding_service.get_embedding(candidate_skill_text)
        
        semantic_similarity = cosine_similarity([job_embedding], [candidate_embedding])[0][0]
        
        # Combine model prediction with semantic similarity
        final_score = 0.7 * skill_score + 0.3 * semantic_similarity
        
        return min(final_score, 1.0)
    
    async def _calculate_experience_match(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> float:
        """Calculate experience matching score"""
        
        job_experience_level = job_data.get("experience_level", "ENTRY")
        candidate_experience = candidate_data.get("experience", [])
        
        if not candidate_experience:
            return 0.0
        
        # Calculate total years of experience
        total_years = 0
        for exp in candidate_experience:
            start_date = exp.get("start_date")
            end_date = exp.get("end_date") or datetime.now()
            if start_date:
                years = (end_date - start_date).days / 365.25
                total_years += years
        
        # Map experience levels to years
        experience_mapping = {
            "ENTRY": (0, 1),
            "JUNIOR": (1, 3),
            "MID": (3, 7),
            "SENIOR": (7, 12),
            "LEAD": (12, 20),
            "EXECUTIVE": (20, 50)
        }
        
        required_range = experience_mapping.get(job_experience_level, (0, 1))
        
        # Calculate match score based on experience range
        if required_range[0] <= total_years <= required_range[1]:
            return 1.0
        elif total_years < required_range[0]:
            return total_years / required_range[0] * 0.8
        else:
            # Overqualified - still a good match but with diminishing returns
            excess_ratio = (total_years - required_range[1]) / required_range[1]
            return max(0.7 - excess_ratio * 0.2, 0.5)
    
    async def _calculate_cultural_fit(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> float:
        """Calculate cultural fit score"""
        
        company_culture = job_data.get("company", {}).get("culture", {})
        candidate_personality = candidate_data.get("personality_traits", [])
        
        if not company_culture or not candidate_personality:
            return 0.5  # Neutral score if no data
        
        # Use cultural fit model
        cultural_score = await self.cultural_fit_model.predict(
            company_culture, candidate_personality
        )
        
        return cultural_score
    
    async def _calculate_location_match(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> float:
        """Calculate location matching score"""
        
        job_location = job_data.get("location", {})
        job_remote = job_data.get("remote_option", False)
        candidate_location = candidate_data.get("location", {})
        candidate_remote_preference = candidate_data.get("remote_work_preference", False)
        
        # If job is remote and candidate prefers remote
        if job_remote and candidate_remote_preference:
            return 1.0
        
        # If job is remote but candidate doesn't prefer remote
        if job_remote and not candidate_remote_preference:
            return 0.7
        
        # If job is not remote but candidate prefers remote
        if not job_remote and candidate_remote_preference:
            return 0.3
        
        # Geographic distance calculation
        if not job_location or not candidate_location:
            return 0.5
        
        # Simple distance calculation (in production, use proper geocoding)
        job_city = job_location.get("city", "")
        candidate_city = candidate_location.get("city", "")
        
        if job_city.lower() == candidate_city.lower():
            return 1.0
        
        # Same state
        if (job_location.get("state") and candidate_location.get("state") and
            job_location["state"].lower() == candidate_location["state"].lower()):
            return 0.8
        
        # Different location
        return 0.3
    
    async def _calculate_salary_match(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> float:
        """Calculate salary matching score"""
        
        job_salary = job_data.get("salary_range")
        candidate_expectation = candidate_data.get("salary_expectation")
        
        if not job_salary or not candidate_expectation:
            return 0.5  # Neutral score if no data
        
        job_min = job_salary.get("min", 0)
        job_max = job_salary.get("max", 0)
        candidate_min = candidate_expectation.get("min", 0)
        candidate_max = candidate_expectation.get("max", 0)
        
        if job_min == 0 or candidate_min == 0:
            return 0.5
        
        # Calculate overlap
        if candidate_max >= job_min and candidate_min <= job_max:
            # There's overlap
            overlap_min = max(candidate_min, job_min)
            overlap_max = min(candidate_max, job_max)
            overlap_range = overlap_max - overlap_min
            
            total_range = max(candidate_max, job_max) - min(candidate_min, job_min)
            
            return overlap_range / total_range if total_range > 0 else 1.0
        else:
            # No overlap
            if candidate_min > job_max:
                # Candidate expects more than job offers
                return 0.2
            else:
                # Job offers more than candidate expects
                return 0.8
    
    async def _calculate_diversity_score(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> float:
        """Calculate diversity score"""
        
        company_diversity = job_data.get("company", {}).get("diversity_metrics", {})
        candidate_diversity = candidate_data.get("diversity", {})
        
        if not company_diversity or not candidate_diversity:
            return 0.5
        
        # Calculate diversity alignment
        diversity_score = 0.0
        diversity_factors = 0
        
        # Gender diversity
        if "gender" in candidate_diversity and "gender_distribution" in company_diversity:
            gender = candidate_diversity["gender"]
            distribution = company_diversity["gender_distribution"]
            
            if gender == "female" and distribution.get("female", 0) < 0.4:
                diversity_score += 1.0
                diversity_factors += 1
            elif gender == "male" and distribution.get("male", 0) < 0.4:
                diversity_score += 1.0
                diversity_factors += 1
            else:
                diversity_score += 0.5
                diversity_factors += 1
        
        # Ethnic diversity
        if "ethnicity" in candidate_diversity and "ethnic_distribution" in company_diversity:
            ethnicity = candidate_diversity["ethnicity"]
            distribution = company_diversity["ethnic_distribution"]
            
            if ethnicity != "white" and distribution.get(ethnicity, 0) < 0.3:
                diversity_score += 1.0
                diversity_factors += 1
            else:
                diversity_score += 0.5
                diversity_factors += 1
        
        return diversity_score / diversity_factors if diversity_factors > 0 else 0.5
    
    def _generate_reasoning(
        self,
        skill_score: float,
        experience_score: float,
        cultural_score: float,
        location_score: float,
        salary_score: float,
        diversity_score: float
    ) -> List[str]:
        """Generate human-readable reasoning for the match"""
        
        reasoning = []
        
        if skill_score > 0.8:
            reasoning.append("Excellent skill alignment with job requirements")
        elif skill_score > 0.6:
            reasoning.append("Good skill match with most requirements")
        elif skill_score > 0.4:
            reasoning.append("Moderate skill alignment, some gaps identified")
        else:
            reasoning.append("Limited skill alignment with job requirements")
        
        if experience_score > 0.8:
            reasoning.append("Experience level perfectly matches job expectations")
        elif experience_score > 0.6:
            reasoning.append("Experience level is well-suited for the role")
        else:
            reasoning.append("Experience level may not align with job requirements")
        
        if cultural_score > 0.8:
            reasoning.append("Strong cultural fit with company values and work style")
        elif cultural_score > 0.6:
            reasoning.append("Good cultural alignment with company environment")
        else:
            reasoning.append("Cultural fit may need evaluation")
        
        if location_score == 1.0:
            reasoning.append("Perfect location match")
        elif location_score > 0.7:
            reasoning.append("Good location compatibility")
        else:
            reasoning.append("Location may present challenges")
        
        if salary_score > 0.8:
            reasoning.append("Salary expectations align well with job offer")
        elif salary_score > 0.6:
            reasoning.append("Salary expectations are mostly compatible")
        else:
            reasoning.append("Salary expectations may need negotiation")
        
        if diversity_score > 0.7:
            reasoning.append("Strong diversity contribution to the team")
        
        return reasoning
    
    def _generate_recommendations(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any],
        skill_score: float,
        experience_score: float
    ) -> List[str]:
        """Generate recommendations for improvement"""
        
        recommendations = []
        
        if skill_score < 0.7:
            missing_skills = self._identify_missing_skills(job_data, candidate_data)
            if missing_skills:
                recommendations.append(f"Consider developing skills in: {', '.join(missing_skills[:3])}")
        
        if experience_score < 0.6:
            recommendations.append("Gain more relevant work experience in the field")
        
        if not candidate_data.get("portfolio"):
            recommendations.append("Build a portfolio showcasing relevant projects")
        
        if not candidate_data.get("certifications"):
            recommendations.append("Consider obtaining industry-relevant certifications")
        
        return recommendations
    
    def _identify_risk_factors(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any],
        overall_score: float
    ) -> List[str]:
        """Identify potential risk factors"""
        
        risk_factors = []
        
        if overall_score < 0.5:
            risk_factors.append("Low overall match score indicates potential mismatch")
        
        if not candidate_data.get("is_verified", False):
            risk_factors.append("Candidate profile not verified")
        
        if not candidate_data.get("resume"):
            risk_factors.append("No resume uploaded")
        
        if candidate_data.get("work_authorization", {}).get("type") == "NO_AUTHORIZATION":
            risk_factors.append("Work authorization may be required")
        
        return risk_factors
    
    def _calculate_confidence(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> float:
        """Calculate confidence in the match based on data completeness"""
        
        job_completeness = 0
        candidate_completeness = 0
        
        # Job data completeness
        if job_data.get("description"): job_completeness += 0.2
        if job_data.get("requirements"): job_completeness += 0.2
        if job_data.get("skills"): job_completeness += 0.2
        if job_data.get("salary_range"): job_completeness += 0.2
        if job_data.get("company", {}).get("culture"): job_completeness += 0.2
        
        # Candidate data completeness
        if candidate_data.get("skills"): candidate_completeness += 0.2
        if candidate_data.get("experience"): candidate_completeness += 0.2
        if candidate_data.get("education"): candidate_completeness += 0.2
        if candidate_data.get("resume"): candidate_completeness += 0.2
        if candidate_data.get("personality_traits"): candidate_completeness += 0.2
        
        return (job_completeness + candidate_completeness) / 2
    
    def _identify_missing_skills(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> List[str]:
        """Identify skills that candidate is missing"""
        
        job_skills = {skill["name"].lower() for skill in job_data.get("skills", [])}
        candidate_skills = {skill["name"].lower() for skill in candidate_data.get("skills", [])}
        
        missing_skills = job_skills - candidate_skills
        return list(missing_skills)
    
    async def _get_job_data(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get job data from database"""
        # This would typically query the database
        # For now, return mock data
        return {
            "id": job_id,
            "title": "Software Engineer",
            "description": "Looking for a skilled software engineer...",
            "requirements": ["Python", "React", "AWS"],
            "skills": [
                {"name": "Python", "weight": 1.0},
                {"name": "React", "weight": 1.0},
                {"name": "AWS", "weight": 0.8}
            ],
            "experience_level": "MID",
            "location": {"city": "San Francisco", "state": "CA"},
            "remote_option": True,
            "salary_range": {"min": 80000, "max": 120000},
            "company": {
                "id": "company_1",
                "name": "Tech Corp",
                "culture": {"values": ["innovation", "collaboration"]}
            }
        }
    
    async def _get_candidates_by_ids(self, candidate_ids: List[str]) -> List[Dict[str, Any]]:
        """Get candidate data by IDs"""
        # This would typically query the database
        # For now, return mock data
        return [
            {
                "id": candidate_id,
                "skills": [
                    {"name": "Python", "proficiency": "ADVANCED"},
                    {"name": "React", "proficiency": "INTERMEDIATE"}
                ],
                "experience": [
                    {"start_date": datetime(2020, 1, 1), "end_date": datetime(2023, 1, 1)}
                ],
                "location": {"city": "San Francisco", "state": "CA"},
                "remote_work_preference": True,
                "salary_expectation": {"min": 90000, "max": 110000}
            }
            for candidate_id in candidate_ids
        ]
    
    async def _get_relevant_candidates(self, job_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get relevant candidates for a job"""
        # This would typically query the database with filters
        # For now, return mock data
        return await self._get_candidates_by_ids(["candidate_1", "candidate_2", "candidate_3"])
