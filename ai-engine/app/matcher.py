import re
import numpy as np
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9+#\s]', ' ', text)
    return text

class SkillSyncMatcher:
    def __init__(self):
        # N-gram range allows catching 'react js', 'data science', 'machine learning'
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            min_df=1
        )

    def _compute_semantic_similarity(self, term_a: str, term_b: str) -> float:
        if not term_a or not term_b:
            return 0.0
        a_clean = clean_text(term_a)
        b_clean = clean_text(term_b)

        if a_clean == b_clean:
            return 1.0

        if a_clean in b_clean or b_clean in a_clean:
            return 0.88

        try:
            tfidf_mat = self.vectorizer.fit_transform([a_clean, b_clean])
            sim = cosine_similarity(tfidf_mat[0:1], tfidf_mat[1:2])[0][0]
            return float(sim)
        except Exception:
            # Fallback token overlap
            tokens_a = set(a_clean.split())
            tokens_b = set(b_clean.split())
            if not tokens_a or not tokens_b:
                return 0.0
            return len(tokens_a & tokens_b) / (np.sqrt(len(tokens_a)) * np.sqrt(len(tokens_b)))

    def evaluate_pair(self, target: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        target_teach = target.get("teachSkills", [])
        target_learn = target.get("learnSkills", [])
        cand_teach = candidate.get("teachSkills", [])
        cand_learn = candidate.get("learnSkills", [])

        # 1. Forward match: Candidate teaches what Target wants to learn
        best_fwd_score = 0.0
        best_teach_to_learn = None

        for t_learn in target_learn:
            req_skill = t_learn.get("skillName", "")
            for c_teach in cand_teach:
                offered_skill = c_teach.get("skillName", "")
                sim = self._compute_semantic_similarity(req_skill, offered_skill)
                if sim > best_fwd_score:
                    best_fwd_score = sim
                    best_teach_to_learn = {
                        "userWants": req_skill,
                        "candidateOffers": offered_skill,
                        "candidateProficiency": c_teach.get("proficiencyLevel", 3),
                        "userTarget": t_learn.get("targetProficiency", 3),
                        "score": sim
                    }

        # 2. Backward match: Target teaches what Candidate wants to learn (Reciprocity)
        best_bwd_score = 0.0
        best_learn_to_teach = None

        for t_teach in target_teach:
            offered_skill = t_teach.get("skillName", "")
            for c_learn in cand_learn:
                req_skill = c_learn.get("skillName", "")
                sim = self._compute_semantic_similarity(offered_skill, req_skill)
                if sim > best_bwd_score:
                    best_bwd_score = sim
                    best_learn_to_teach = {
                        "candidateWants": req_skill,
                        "userOffers": offered_skill,
                        "userProficiency": t_teach.get("proficiencyLevel", 3),
                        "score": sim
                    }

        reasons = []

        # Reciprocal Scoring (0 - 55 pts)
        reciprocal_points = 0
        is_direct_reciprocal = best_fwd_score >= 0.7 and best_bwd_score >= 0.7

        if is_direct_reciprocal:
            reciprocal_points = 55
            match_type = "Direct Reciprocal Match"
            reasons.append(
                f"Perfect Reciprocal Match: They teach {best_teach_to_learn['candidateOffers']} which you want to learn, and they want to learn {best_learn_to_teach['userOffers']} which you teach!"
            )
        elif best_fwd_score >= 0.7:
            reciprocal_points = 36
            match_type = "High Potential Instructor"
            reasons.append(
                f"Strong Skill Alignment: They teach {best_teach_to_learn['candidateOffers']}, matching your goal to learn {best_teach_to_learn['userWants']}."
            )
        elif best_bwd_score >= 0.7:
            reciprocal_points = 26
            match_type = "Eager Learner / Mentorship"
            reasons.append(
                f"Mentorship Opportunity: They are eager to learn {best_learn_to_teach['candidateWants']} from your expertise in {best_learn_to_teach['userOffers']}."
            )
        else:
            reciprocal_points = int((best_fwd_score + best_bwd_score) * 15)
            match_type = "Exploration Match"

        # Proficiency & Experience Alignment (0 - 15 pts)
        exp_points = 0
        if best_teach_to_learn:
            c_prof = best_teach_to_learn.get("candidateProficiency", 3)
            u_target = best_teach_to_learn.get("userTarget", 3)
            if c_prof >= u_target:
                exp_points = 15
                reasons.append(
                    f"Proficiency Match: Teacher has level {c_prof}/5 proficiency, meeting your target of {u_target}/5."
                )
            elif c_prof >= u_target - 1:
                exp_points = 10
            else:
                exp_points = 5
        else:
            exp_points = 5

        # Shared Interests & College Campus (0 - 15 pts)
        interest_points = 0
        t_interests = [clean_text(i) for i in target.get("interests", [])]
        c_interests = [clean_text(i) for i in candidate.get("interests", [])]
        shared = [i for i in t_interests if i and i in c_interests]

        if shared:
            interest_points += min(10, len(shared) * 4)
            reasons.append(f"Shared Interests: Both interested in {', '.join(target.get('interests', [])[:2])}.")

        t_college = clean_text(target.get("college", ""))
        c_college = clean_text(candidate.get("college", ""))
        if t_college and c_college and (t_college in c_college or c_college in t_college):
            interest_points += 5
            reasons.append(f"Campus Peer: Both attending {candidate.get('college')}.")

        # Availability & Mode Overlap (0 - 15 pts)
        mode_points = 0
        t_mode = (target.get("preferredMode") or "online").lower()
        c_mode = (candidate.get("preferredMode") or "online").lower()

        if t_mode == c_mode or t_mode == "hybrid" or c_mode == "hybrid":
            mode_points += 8
            reasons.append(f"Mode Aligned: Both support {t_mode.capitalize()} skill exchange.")
        else:
            mode_points += 3

        t_avail = set([clean_text(a) for a in target.get("availability", [])])
        c_avail = set([clean_text(a) for a in candidate.get("availability", [])])
        avail_overlap = t_avail & c_avail

        if avail_overlap:
            mode_points += 7
            reasons.append("Schedule Match: Overlapping availability during study sessions.")
        else:
            mode_points += 3

        total_score = min(100, max(0, reciprocal_points + exp_points + interest_points + mode_points))

        if not reasons:
            reasons.append("Compatible academic background and learning profile.")

        return {
            "candidateProfile": candidate,
            "compatibilityScore": int(total_score),
            "matchType": match_type,
            "matchingSkills": {
                "teachToLearn": best_teach_to_learn["candidateOffers"] if best_teach_to_learn else None,
                "learnToTeach": best_learn_to_teach["userOffers"] if best_learn_to_teach else None
            },
            "reasons": reasons
        }

    def rank_candidates(self, target: Dict[str, Any], candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = [self.evaluate_pair(target, c) for c in candidates]
        results.sort(key=lambda x: x["compatibilityScore"], reverse=True)
        return results
