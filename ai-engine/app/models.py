from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class SkillTeach(BaseModel):
    skillName: str
    category: Optional[str] = "General"
    proficiencyLevel: int = Field(default=3, ge=1, le=5)
    yearsOfExperience: Optional[float] = 1.0
    description: Optional[str] = ""

class SkillLearn(BaseModel):
    skillName: str
    category: Optional[str] = "General"
    targetProficiency: int = Field(default=3, ge=1, le=5)
    priority: Optional[str] = "medium"
    notes: Optional[str] = ""

class StudentProfileData(BaseModel):
    _id: Optional[str] = None
    user: Optional[Any] = None
    college: Optional[str] = "Campus"
    department: Optional[str] = "General"
    academicYear: Optional[str] = "3rd Year"
    headline: Optional[str] = ""
    bio: Optional[str] = ""
    avatar: Optional[str] = ""
    teachSkills: List[SkillTeach] = []
    learnSkills: List[SkillLearn] = []
    interests: List[str] = []
    availability: List[str] = []
    preferredMode: Optional[str] = "online"
    location: Optional[str] = ""
    averageRating: Optional[float] = 0.0
    totalReviews: Optional[int] = 0
    completedExchanges: Optional[int] = 0

class MatchingSkills(BaseModel):
    teachToLearn: Optional[str] = None
    learnToTeach: Optional[str] = None

class RecommendationItem(BaseModel):
    candidateProfile: Dict[str, Any]
    compatibilityScore: int
    matchType: str
    matchingSkills: MatchingSkills
    reasons: List[str]

class MatchRequest(BaseModel):
    targetProfile: Dict[str, Any]
    candidates: List[Dict[str, Any]]

class MatchResponse(BaseModel):
    success: bool = True
    count: int
    recommendations: List[RecommendationItem]
    modelEngine: str = "scikit-learn TF-IDF + Cosine Reciprocity Scorer"
