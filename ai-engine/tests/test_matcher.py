import pytest
from app.matcher import SkillSyncMatcher

@pytest.fixture
def matcher():
    return SkillSyncMatcher()

def test_direct_reciprocal_match_high_score(matcher):
    # Student A: Aisha teaches Python & Machine Learning, wants UI/UX Design & React
    student_a = {
        "college": "DTU",
        "teachSkills": [
            {"skillName": "Python", "proficiencyLevel": 5},
            {"skillName": "Machine Learning", "proficiencyLevel": 4}
        ],
        "learnSkills": [
            {"skillName": "UI/UX Design", "targetProficiency": 4},
            {"skillName": "React.js", "targetProficiency": 4}
        ],
        "interests": ["Artificial Intelligence", "Design"],
        "availability": ["Weekends"],
        "preferredMode": "online"
    }

    # Student B: Sonali teaches UI/UX Design & React, wants Python & Machine Learning
    student_b = {
        "college": "IIT Bombay",
        "teachSkills": [
            {"skillName": "UI/UX Design", "proficiencyLevel": 5},
            {"skillName": "React.js", "proficiencyLevel": 4}
        ],
        "learnSkills": [
            {"skillName": "Python", "targetProficiency": 5},
            {"skillName": "Machine Learning", "targetProficiency": 4}
        ],
        "interests": ["Design", "Artificial Intelligence"],
        "availability": ["Weekends"],
        "preferredMode": "online"
    }

    result = matcher.evaluate_pair(student_a, student_b)

    assert result["compatibilityScore"] >= 80
    assert result["matchType"] == "Direct Reciprocal Match"
    assert "UI/UX Design" in result["matchingSkills"]["teachToLearn"]
    assert "Python" in result["matchingSkills"]["learnToTeach"]
    assert len(result["reasons"]) >= 2

def test_unrelated_skills_low_score(matcher):
    student_a = {
        "college": "DTU",
        "teachSkills": [{"skillName": "Python", "proficiencyLevel": 5}],
        "learnSkills": [{"skillName": "Deep Learning", "targetProficiency": 4}],
        "interests": ["Robotics"],
        "availability": ["Weekdays"],
        "preferredMode": "online"
    }

    student_c = {
        "college": "Sorbonne",
        "teachSkills": [{"skillName": "French Language", "proficiencyLevel": 5}],
        "learnSkills": [{"skillName": "Cooking & Culinary Arts", "targetProficiency": 3}],
        "interests": ["Gastronomy"],
        "availability": ["Sundays"],
        "preferredMode": "in-person"
    }

    result = matcher.evaluate_pair(student_a, student_c)
    assert result["compatibilityScore"] < 40
    assert result["matchType"] == "Exploration Match"

def test_candidates_ranking(matcher):
    target = {
        "college": "DTU",
        "teachSkills": [{"skillName": "Python", "proficiencyLevel": 5}],
        "learnSkills": [{"skillName": "UI/UX Design", "targetProficiency": 4}],
        "interests": ["Design"],
        "availability": ["Weekends"],
        "preferredMode": "online"
    }

    cand_reciprocal = {
        "_id": "1",
        "college": "DTU",
        "teachSkills": [{"skillName": "UI/UX Design", "proficiencyLevel": 5}],
        "learnSkills": [{"skillName": "Python", "targetProficiency": 4}],
        "interests": ["Design"],
        "availability": ["Weekends"],
        "preferredMode": "online"
    }

    cand_partial = {
        "_id": "2",
        "college": "NIT",
        "teachSkills": [{"skillName": "UI/UX Design", "proficiencyLevel": 3}],
        "learnSkills": [{"skillName": "Java", "targetProficiency": 4}],
        "interests": ["Music"],
        "availability": ["Weekdays"],
        "preferredMode": "online"
    }

    cand_unrelated = {
        "_id": "3",
        "college": "Oxford",
        "teachSkills": [{"skillName": "Spanish Language", "proficiencyLevel": 4}],
        "learnSkills": [{"skillName": "Guitar", "targetProficiency": 3}],
        "interests": ["Literature"],
        "availability": ["Weekdays"],
        "preferredMode": "in-person"
    }

    ranked = matcher.rank_candidates(target, [cand_unrelated, cand_partial, cand_reciprocal])

    assert ranked[0]["candidateProfile"]["_id"] == "1"
    assert ranked[0]["compatibilityScore"] > ranked[1]["compatibilityScore"]
    assert ranked[1]["compatibilityScore"] > ranked[2]["compatibilityScore"]
