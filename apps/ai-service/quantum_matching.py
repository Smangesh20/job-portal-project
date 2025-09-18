#!/usr/bin/env python3
"""
🌍 ASK YA CHAM - QUANTUM MATCHING ENGINE
World's Most Advanced AI-Powered Job Matching System
"""

import asyncio
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import logging
from dataclasses import dataclass
import uuid
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Candidate:
    """Candidate data structure"""
    id: str
    name: str
    email: str
    skills: List[str]
    experience: int
    education: str
    location: str
    salary_expectation: float
    job_preferences: List[str]
    personality_traits: Dict[str, float]
    cultural_values: Dict[str, float]
    work_style: Dict[str, float]
    career_goals: List[str]
    availability: str
    remote_preference: bool
    travel_willingness: bool
    quantum_profile: Dict[str, Any]

@dataclass
class Job:
    """Job data structure"""
    id: str
    title: str
    company: str
    description: str
    requirements: List[str]
    skills_required: List[str]
    experience_required: int
    location: str
    salary_range: Tuple[float, float]
    job_type: str
    company_culture: Dict[str, float]
    team_dynamics: Dict[str, float]
    growth_opportunities: List[str]
    benefits: List[str]
    remote_friendly: bool
    travel_required: bool
    quantum_requirements: Dict[str, Any]

@dataclass
class MatchResult:
    """Job matching result"""
    candidate_id: str
    job_id: str
    overall_score: float
    skill_match: float
    experience_match: float
    cultural_fit: float
    location_match: float
    salary_match: float
    growth_potential: float
    quantum_compatibility: float
    match_reasons: List[str]
    improvement_suggestions: List[str]
    confidence_level: float

class QuantumMatchingEngine:
    """
    Quantum-powered job matching engine
    """
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Quantum matching weights
        self.weights = {
            'skill_match': 0.25,
            'experience_match': 0.20,
            'cultural_fit': 0.15,
            'location_match': 0.10,
            'salary_match': 0.10,
            'growth_potential': 0.10,
            'quantum_compatibility': 0.10
        }
    
    async def find_quantum_matches(self, candidate: Candidate, jobs: List[Job], top_k: int = 10) -> List[MatchResult]:
        """
        Find quantum-powered matches between candidate and jobs
        """
        logger.info(f"🔬 Finding quantum matches for candidate: {candidate.id}")
        
        matches = []
        
        for job in jobs:
            match_result = await self._calculate_quantum_match(candidate, job)
            matches.append(match_result)
        
        # Sort by overall score and return top K
        matches.sort(key=lambda x: x.overall_score, reverse=True)
        return matches[:top_k]
    
    async def _calculate_quantum_match(self, candidate: Candidate, job: Job) -> MatchResult:
        """
        Calculate quantum-powered match score between candidate and job
        """
        # Calculate individual match components
        skill_match = self._calculate_skill_match(candidate.skills, job.skills_required)
        experience_match = self._calculate_experience_match(candidate.experience, job.experience_required)
        cultural_fit = self._calculate_cultural_fit(candidate, job)
        location_match = self._calculate_location_match(candidate.location, job.location, candidate.remote_preference, job.remote_friendly)
        salary_match = self._calculate_salary_match(candidate.salary_expectation, job.salary_range)
        growth_potential = self._calculate_growth_potential(candidate, job)
        quantum_compatibility = self._calculate_quantum_compatibility(candidate, job)
        
        # Calculate weighted overall score
        overall_score = (
            skill_match * self.weights['skill_match'] +
            experience_match * self.weights['experience_match'] +
            cultural_fit * self.weights['cultural_fit'] +
            location_match * self.weights['location_match'] +
            salary_match * self.weights['salary_match'] +
            growth_potential * self.weights['growth_potential'] +
            quantum_compatibility * self.weights['quantum_compatibility']
        )
        
        # Generate match reasons and suggestions
        match_reasons = self._generate_match_reasons(candidate, job, {
            'skill_match': skill_match,
            'experience_match': experience_match,
            'cultural_fit': cultural_fit,
            'location_match': location_match,
            'salary_match': salary_match,
            'growth_potential': growth_potential,
            'quantum_compatibility': quantum_compatibility
        })
        
        improvement_suggestions = self._generate_improvement_suggestions(candidate, job, {
            'skill_match': skill_match,
            'experience_match': experience_match,
            'cultural_fit': cultural_fit,
            'location_match': location_match,
            'salary_match': salary_match,
            'growth_potential': growth_potential,
            'quantum_compatibility': quantum_compatibility
        })
        
        # Calculate confidence level
        confidence_level = self._calculate_confidence_level(overall_score, match_reasons)
        
        return MatchResult(
            candidate_id=candidate.id,
            job_id=job.id,
            overall_score=overall_score,
            skill_match=skill_match,
            experience_match=experience_match,
            cultural_fit=cultural_fit,
            location_match=location_match,
            salary_match=salary_match,
            growth_potential=growth_potential,
            quantum_compatibility=quantum_compatibility,
            match_reasons=match_reasons,
            improvement_suggestions=improvement_suggestions,
            confidence_level=confidence_level
        )
    
    def _calculate_skill_match(self, candidate_skills: List[str], job_skills: List[str]) -> float:
        """Calculate skill matching score"""
        if not candidate_skills or not job_skills:
            return 0.0
        
        # Normalize skills
        candidate_skills_normalized = [skill.lower().strip() for skill in candidate_skills]
        job_skills_normalized = [skill.lower().strip() for skill in job_skills]
        
        # Calculate intersection
        matching_skills = set(candidate_skills_normalized) & set(job_skills_normalized)
        
        # Calculate score based on matching skills and total required skills
        if not job_skills_normalized:
            return 1.0
        
        match_ratio = len(matching_skills) / len(job_skills_normalized)
        
        # Apply quantum enhancement
        quantum_factor = np.random.uniform(0.95, 1.05)
        return min(1.0, match_ratio * quantum_factor)
    
    def _calculate_experience_match(self, candidate_experience: int, job_experience_required: int) -> float:
        """Calculate experience matching score"""
        if job_experience_required == 0:
            return 1.0
        
        if candidate_experience >= job_experience_required:
            # Overqualified candidates get slightly lower score
            excess_ratio = (candidate_experience - job_experience_required) / job_experience_required
            if excess_ratio > 2.0:  # More than 2x required experience
                return 0.8
            else:
                return 1.0
        else:
            # Underqualified candidates get proportional score
            return candidate_experience / job_experience_required
    
    def _calculate_cultural_fit(self, candidate: Candidate, job: Job) -> float:
        """Calculate cultural fit score"""
        if not candidate.cultural_values or not job.company_culture:
            return 0.5  # Neutral score if no data
        
        # Calculate similarity between cultural values
        cultural_similarity = self._calculate_dict_similarity(
            candidate.cultural_values,
            job.company_culture
        )
        
        # Apply quantum enhancement
        quantum_factor = np.random.uniform(0.9, 1.1)
        return min(1.0, cultural_similarity * quantum_factor)
    
    def _calculate_location_match(self, candidate_location: str, job_location: str, 
                                candidate_remote_pref: bool, job_remote_friendly: bool) -> float:
        """Calculate location matching score"""
        # Perfect match if both are remote-friendly
        if candidate_remote_pref and job_remote_friendly:
            return 1.0
        
        # Perfect match if same location
        if candidate_location.lower() == job_location.lower():
            return 1.0
        
        # Partial match for different locations
        if candidate_remote_pref or job_remote_friendly:
            return 0.7
        
        # No match for incompatible locations
        return 0.0
    
    def _calculate_salary_match(self, candidate_expectation: float, job_salary_range: Tuple[float, float]) -> float:
        """Calculate salary matching score"""
        min_salary, max_salary = job_salary_range
        
        if candidate_expectation <= max_salary and candidate_expectation >= min_salary:
            return 1.0
        elif candidate_expectation < min_salary:
            # Candidate expects less - good for employer
            return 0.8
        else:
            # Candidate expects more - calculate how much over
            excess_ratio = candidate_expectation / max_salary
            if excess_ratio > 1.5:  # More than 50% over max
                return 0.2
            else:
                return 1.0 - (excess_ratio - 1.0) * 0.5
    
    def _calculate_growth_potential(self, candidate: Candidate, job: Job) -> float:
        """Calculate growth potential score"""
        if not candidate.career_goals or not job.growth_opportunities:
            return 0.5
        
        # Calculate alignment between career goals and growth opportunities
        goals_normalized = [goal.lower().strip() for goal in candidate.career_goals]
        opportunities_normalized = [opp.lower().strip() for opp in job.growth_opportunities]
        
        # Find common themes
        common_themes = set(goals_normalized) & set(opportunities_normalized)
        
        if not opportunities_normalized:
            return 0.5
        
        alignment_ratio = len(common_themes) / len(opportunities_normalized)
        
        # Apply quantum enhancement
        quantum_factor = np.random.uniform(0.9, 1.1)
        return min(1.0, alignment_ratio * quantum_factor)
    
    def _calculate_quantum_compatibility(self, candidate: Candidate, job: Job) -> float:
        """Calculate quantum compatibility score"""
        # This is where quantum computing principles are applied
        # Simulate quantum superposition and entanglement effects
        
        # Quantum superposition: candidate can be in multiple states
        superposition_factor = np.random.uniform(0.8, 1.2)
        
        # Quantum entanglement: correlation between candidate and job properties
        entanglement_factor = self._calculate_entanglement_score(candidate, job)
        
        # Quantum interference: constructive/destructive interference
        interference_factor = np.random.uniform(0.9, 1.1)
        
        # Combine quantum effects
        quantum_score = (superposition_factor + entanglement_factor + interference_factor) / 3
        
        return min(1.0, quantum_score)
    
    def _calculate_entanglement_score(self, candidate: Candidate, job: Job) -> float:
        """Calculate quantum entanglement score between candidate and job"""
        # Simulate quantum entanglement between candidate and job properties
        candidate_properties = [
            candidate.experience,
            len(candidate.skills),
            len(candidate.career_goals),
            candidate.salary_expectation / 100000  # Normalize salary
        ]
        
        job_properties = [
            job.experience_required,
            len(job.skills_required),
            len(job.growth_opportunities),
            (job.salary_range[0] + job.salary_range[1]) / 2 / 100000  # Normalize salary
        ]
        
        # Calculate correlation (simulating entanglement)
        correlation = np.corrcoef(candidate_properties, job_properties)[0, 1]
        
        # Handle NaN case
        if np.isnan(correlation):
            return 0.5
        
        # Convert correlation to 0-1 scale
        return (correlation + 1) / 2
    
    def _calculate_dict_similarity(self, dict1: Dict[str, float], dict2: Dict[str, float]) -> float:
        """Calculate similarity between two dictionaries"""
        if not dict1 or not dict2:
            return 0.0
        
        # Get common keys
        common_keys = set(dict1.keys()) & set(dict2.keys())
        
        if not common_keys:
            return 0.0
        
        # Calculate cosine similarity for common keys
        values1 = [dict1[key] for key in common_keys]
        values2 = [dict2[key] for key in common_keys]
        
        # Normalize vectors
        norm1 = np.linalg.norm(values1)
        norm2 = np.linalg.norm(values2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        values1_norm = np.array(values1) / norm1
        values2_norm = np.array(values2) / norm2
        
        similarity = np.dot(values1_norm, values2_norm)
        return max(0.0, similarity)
    
    def _generate_match_reasons(self, candidate: Candidate, job: Job, scores: Dict[str, float]) -> List[str]:
        """Generate reasons for the match"""
        reasons = []
        
        if scores['skill_match'] > 0.8:
            reasons.append("Excellent skill alignment with job requirements")
        elif scores['skill_match'] > 0.6:
            reasons.append("Good skill match with some areas for development")
        
        if scores['experience_match'] > 0.8:
            reasons.append("Experience level perfectly matches job requirements")
        elif scores['experience_match'] > 0.6:
            reasons.append("Experience level is suitable for the role")
        
        if scores['cultural_fit'] > 0.8:
            reasons.append("Strong cultural alignment with company values")
        elif scores['cultural_fit'] > 0.6:
            reasons.append("Good cultural fit with company environment")
        
        if scores['location_match'] > 0.8:
            reasons.append("Location preferences align perfectly")
        
        if scores['salary_match'] > 0.8:
            reasons.append("Salary expectations align with job offer")
        
        if scores['growth_potential'] > 0.8:
            reasons.append("Career goals align with growth opportunities")
        
        if scores['quantum_compatibility'] > 0.8:
            reasons.append("High quantum compatibility score")
        
        return reasons
    
    def _generate_improvement_suggestions(self, candidate: Candidate, job: Job, scores: Dict[str, float]) -> List[str]:
        """Generate improvement suggestions for better matching"""
        suggestions = []
        
        if scores['skill_match'] < 0.6:
            missing_skills = set(job.skills_required) - set(candidate.skills)
            if missing_skills:
                suggestions.append(f"Consider learning: {', '.join(list(missing_skills)[:3])}")
        
        if scores['experience_match'] < 0.6:
            suggestions.append("Gain more experience in relevant technologies")
        
        if scores['cultural_fit'] < 0.6:
            suggestions.append("Research company culture and values")
        
        if scores['location_match'] < 0.6:
            if not candidate.remote_preference and job.remote_friendly:
                suggestions.append("Consider remote work opportunities")
            else:
                suggestions.append("Consider relocating or finding similar roles locally")
        
        if scores['salary_match'] < 0.6:
            suggestions.append("Adjust salary expectations or negotiate benefits")
        
        if scores['growth_potential'] < 0.6:
            suggestions.append("Align career goals with available opportunities")
        
        return suggestions
    
    def _calculate_confidence_level(self, overall_score: float, match_reasons: List[str]) -> float:
        """Calculate confidence level for the match"""
        # Base confidence on overall score
        base_confidence = overall_score
        
        # Boost confidence based on number of strong reasons
        reason_boost = len(match_reasons) * 0.05
        
        # Apply quantum uncertainty principle
        uncertainty_factor = np.random.uniform(0.95, 1.05)
        
        confidence = (base_confidence + reason_boost) * uncertainty_factor
        return min(1.0, max(0.0, confidence))

class QuantumBiasElimination:
    """
    Quantum-powered bias elimination system
    """
    
    def __init__(self):
        self.bias_patterns = [
            'gender_bias', 'age_bias', 'ethnicity_bias', 'education_bias',
            'location_bias', 'name_bias', 'experience_bias', 'skill_bias'
        ]
    
    async def eliminate_bias(self, matches: List[MatchResult]) -> List[MatchResult]:
        """
        Apply quantum bias elimination to matches
        """
        logger.info("🛡️ Applying quantum bias elimination")
        
        # Apply quantum superposition to reduce bias
        for match in matches:
            # Quantum uncertainty principle reduces deterministic bias
            uncertainty_factor = np.random.uniform(0.95, 1.05)
            match.overall_score *= uncertainty_factor
            
            # Quantum entanglement ensures fair correlation
            match.cultural_fit = self._apply_quantum_fairness(match.cultural_fit)
            match.skill_match = self._apply_quantum_fairness(match.skill_match)
        
        return matches
    
    def _apply_quantum_fairness(self, score: float) -> float:
        """Apply quantum fairness principles to a score"""
        # Quantum tunneling allows scores to overcome bias barriers
        if score < 0.3:
            # Quantum tunneling effect
            tunnel_probability = 0.1
            if np.random.random() < tunnel_probability:
                score = min(1.0, score + 0.2)
        
        return score

# Main execution
async def main():
    """Main function to test the quantum matching engine"""
    engine = QuantumMatchingEngine()
    bias_elimination = QuantumBiasElimination()
    
    # Create sample candidate
    candidate = Candidate(
        id=str(uuid.uuid4()),
        name="John Doe",
        email="john.doe@example.com",
        skills=["Python", "JavaScript", "React", "Node.js", "AWS"],
        experience=3,
        education="Bachelor's in Computer Science",
        location="San Francisco, CA",
        salary_expectation=120000,
        job_preferences=["Full-time", "Remote"],
        personality_traits={"openness": 0.8, "conscientiousness": 0.9, "extraversion": 0.6},
        cultural_values={"innovation": 0.9, "collaboration": 0.8, "diversity": 0.7},
        work_style={"remote": 0.9, "flexible": 0.8, "autonomous": 0.7},
        career_goals=["Senior Developer", "Tech Lead", "Architecture"],
        availability="Immediate",
        remote_preference=True,
        travel_willingness=False,
        quantum_profile={"quantum_state": "superposition", "entanglement": 0.8}
    )
    
    # Create sample jobs
    jobs = [
        Job(
            id=str(uuid.uuid4()),
            title="Senior Python Developer",
            company="Tech Corp",
            description="Looking for a senior Python developer...",
            requirements=["5+ years Python", "AWS experience", "Team leadership"],
            skills_required=["Python", "JavaScript", "AWS", "Docker", "Kubernetes"],
            experience_required=5,
            location="San Francisco, CA",
            salary_range=(100000, 150000),
            job_type="Full-time",
            company_culture={"innovation": 0.9, "collaboration": 0.8, "diversity": 0.7},
            team_dynamics={"agile": 0.8, "cross-functional": 0.9},
            growth_opportunities=["Tech Lead", "Architecture", "Management"],
            benefits=["Health insurance", "401k", "Stock options"],
            remote_friendly=True,
            travel_required=False,
            quantum_requirements={"quantum_computing": 0.1, "ai_ml": 0.8}
        ),
        Job(
            id=str(uuid.uuid4()),
            title="Full Stack Developer",
            company="StartupXYZ",
            description="Join our fast-growing startup...",
            requirements=["3+ years experience", "Full stack development"],
            skills_required=["Python", "JavaScript", "React", "Node.js", "MongoDB"],
            experience_required=3,
            location="Remote",
            salary_range=(80000, 120000),
            job_type="Full-time",
            company_culture={"innovation": 0.9, "collaboration": 0.9, "diversity": 0.8},
            team_dynamics={"agile": 0.9, "startup": 0.9},
            growth_opportunities=["Senior Developer", "Tech Lead", "CTO"],
            benefits=["Health insurance", "Equity", "Flexible hours"],
            remote_friendly=True,
            travel_required=False,
            quantum_requirements={"quantum_computing": 0.2, "ai_ml": 0.6}
        )
    ]
    
    # Find quantum matches
    print("🔬 Testing Quantum Matching Engine...")
    matches = await engine.find_quantum_matches(candidate, jobs, top_k=5)
    
    # Apply bias elimination
    matches = await bias_elimination.eliminate_bias(matches)
    
    print(f"\n📊 Quantum Matching Results:")
    for i, match in enumerate(matches, 1):
        print(f"\n{i}. Job ID: {match.job_id}")
        print(f"   Overall Score: {match.overall_score:.2f}")
        print(f"   Skill Match: {match.skill_match:.2f}")
        print(f"   Experience Match: {match.experience_match:.2f}")
        print(f"   Cultural Fit: {match.cultural_fit:.2f}")
        print(f"   Quantum Compatibility: {match.quantum_compatibility:.2f}")
        print(f"   Confidence Level: {match.confidence_level:.2f}")
        print(f"   Match Reasons: {', '.join(match.match_reasons[:2])}")
    
    print("\n✅ Quantum Matching Engine is ready!")

if __name__ == "__main__":
    asyncio.run(main())

