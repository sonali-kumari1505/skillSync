import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import MatchRequest, MatchResponse, RecommendationItem
from .matcher import SkillSyncMatcher

app = FastAPI(
    title="SkillSync AI Recommendation Engine",
    description="Intelligent reciprocal skill exchange matcher using scikit-learn TF-IDF and Cosine Similarity",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

matcher = SkillSyncMatcher()

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "SkillSync AI Engine",
        "algorithm": "Reciprocal TF-IDF Vectorization & Multi-Factor Compatibility Scorer",
        "version": "1.0.0"
    }

@app.get("/health")
def api_health():
    return {"status": "healthy"}

@app.post("/recommendations", response_model=MatchResponse)
def get_recommendations(request: MatchRequest):
    try:
        ranked = matcher.rank_candidates(request.targetProfile, request.candidates)
        recommendations = [RecommendationItem(**item) for item in ranked]
        return MatchResponse(
            success=True,
            count=len(recommendations),
            recommendations=recommendations
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation evaluation failed: {str(e)}")

@app.post("/compare")
def compare_students(targetProfile: dict, candidateProfile: dict):
    try:
        result = matcher.evaluate_pair(targetProfile, candidateProfile)
        return {"success": True, "comparison": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
