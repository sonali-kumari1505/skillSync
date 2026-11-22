const axios = require('axios');

/**
 * Native Node.js fallback algorithm for semantic similarity & reciprocal matching
 * Computes cosine similarity, token n-grams, and multi-factor compatibility
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function computeCosineSimilarity(tokens1, tokens2) {
  if (!tokens1.length || !tokens2.length) return 0;
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }

  const denominator = Math.sqrt(set1.size) * Math.sqrt(set2.size);
  return denominator === 0 ? 0 : intersection / denominator;
}

function skillMatchScore(skillA, skillB) {
  if (!skillA || !skillB) return 0;
  const a = skillA.toLowerCase().trim();
  const b = skillB.toLowerCase().trim();
  if (a === b) return 1.0;

  // Substring or prefix match (e.g. "React" & "React.js", "Python" & "Python 3")
  if (a.includes(b) || b.includes(a)) return 0.85;

  // Token cosine similarity
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  return computeCosineSimilarity(tokensA, tokensB);
}

function calculateCompatibilityNative(targetProfile, candidateProfile) {
  const targetTeach = (targetProfile.teachSkills || []).map((s) => s.skillName);
  const targetLearn = (targetProfile.learnSkills || []).map((s) => s.skillName);
  const candTeach = (candidateProfile.teachSkills || []).map((s) => s.skillName);
  const candLearn = (candidateProfile.learnSkills || []).map((s) => s.skillName);

  let bestReciprocalScore = 0;
  let matchingTeachToLearn = null; // What candidate teaches that target wants
  let matchingLearnToTeach = null; // What target teaches that candidate wants
  const reasons = [];

  // 1. Check what Candidate teaches that Target wants to learn
  let forwardBest = 0;
  for (const tLearn of targetLearn) {
    for (const cTeach of candTeach) {
      const score = skillMatchScore(tLearn, cTeach);
      if (score > forwardBest) {
        forwardBest = score;
        matchingTeachToLearn = { userWants: tLearn, candidateOffers: cTeach, score };
      }
    }
  }

  // 2. Check what Target teaches that Candidate wants to learn (Reciprocity)
  let backwardBest = 0;
  for (const tTeach of targetTeach) {
    for (const cLearn of candLearn) {
      const score = skillMatchScore(tTeach, cLearn);
      if (score > backwardBest) {
        backwardBest = score;
        matchingLearnToTeach = { candidateWants: cLearn, userOffers: tTeach, score };
      }
    }
  }

  // Reciprocal weight calculation (Up to 55 points)
  let mutualPoints = 0;
  if (forwardBest >= 0.7 && backwardBest >= 0.7) {
    mutualPoints = 55;
    reasons.push(
      `Perfect Reciprocal Match: They teach ${matchingTeachToLearn.candidateOffers} which you want, and want to learn ${matchingLearnToTeach.userOffers} which you teach!`
    );
  } else if (forwardBest >= 0.7) {
    mutualPoints = 35;
    reasons.push(`Strong Skill Match: They teach ${matchingTeachToLearn.candidateOffers} which matches your goal to learn ${matchingTeachToLearn.userWants}.`);
  } else if (backwardBest >= 0.7) {
    mutualPoints = 25;
    reasons.push(`Potential Mentorship: They are eager to learn ${matchingLearnToTeach.candidateWants} from your skill in ${matchingLearnToTeach.userOffers}.`);
  } else {
    mutualPoints = Math.round((forwardBest + backwardBest) * 15);
  }

  // 3. Experience / Proficiency delta (Up to 15 points)
  let expPoints = 0;
  if (matchingTeachToLearn) {
    const candidateTeachObj = (candidateProfile.teachSkills || []).find(
      (s) => s.skillName.toLowerCase() === matchingTeachToLearn.candidateOffers.toLowerCase()
    );
    const targetLearnObj = (targetProfile.learnSkills || []).find(
      (s) => s.skillName.toLowerCase() === matchingTeachToLearn.userWants.toLowerCase()
    );

    const candProf = candidateTeachObj ? candidateTeachObj.proficiencyLevel : 3;
    const targetReq = targetLearnObj ? targetLearnObj.targetProficiency : 3;

    if (candProf >= targetReq) {
      expPoints = 15;
      reasons.push(`Instructor Proficiency: Candidate has level ${candProf}/5 proficiency, fully meeting your target level ${targetReq}/5.`);
    } else {
      expPoints = 8;
    }
  } else {
    expPoints = 5;
  }

  // 4. Shared Interests & Academic Context (Up to 15 points)
  let interestPoints = 0;
  const targetInterests = targetProfile.interests || [];
  const candInterests = candidateProfile.interests || [];
  const sharedInterests = targetInterests.filter((it) =>
    candInterests.some((cit) => cit.toLowerCase() === it.toLowerCase())
  );

  if (sharedInterests.length > 0) {
    interestPoints += Math.min(10, sharedInterests.length * 4);
    reasons.push(`Shared Interests: Both interested in ${sharedInterests.slice(0, 3).join(', ')}.`);
  }

  if (targetProfile.college && candidateProfile.college &&
      targetProfile.college.toLowerCase() === candidateProfile.college.toLowerCase()) {
    interestPoints += 5;
    reasons.push(`Campus Peer: Both attending ${candidateProfile.college}.`);
  }

  // 5. Availability & Learning Mode Alignment (Up to 15 points)
  let modePoints = 0;
  if (targetProfile.preferredMode === candidateProfile.preferredMode ||
      targetProfile.preferredMode === 'hybrid' ||
      candidateProfile.preferredMode === 'hybrid') {
    modePoints += 8;
    reasons.push(`Learning Mode Aligned: Preferred mode is compatible (${targetProfile.preferredMode} / ${candidateProfile.preferredMode}).`);
  }

  const targetAvail = targetProfile.availability || [];
  const candAvail = candidateProfile.availability || [];
  const sharedAvail = targetAvail.filter((d) =>
    candAvail.some((cd) => cd.toLowerCase() === d.toLowerCase())
  );
  if (sharedAvail.length > 0) {
    modePoints += 7;
    reasons.push(`Schedule Overlap: Both available on ${sharedAvail.slice(0, 2).join(' & ')}.`);
  } else {
    modePoints += 3;
  }

  const totalScore = Math.min(100, Math.max(0, mutualPoints + expPoints + interestPoints + modePoints));

  if (reasons.length === 0) {
    reasons.push('General skill and college collaboration opportunity.');
  }

  return {
    candidateProfile,
    compatibilityScore: totalScore,
    matchType: mutualPoints >= 50 ? 'Direct Reciprocal Match' : mutualPoints >= 30 ? 'High Potential' : 'Explore Match',
    matchingSkills: {
      teachToLearn: matchingTeachToLearn ? matchingTeachToLearn.candidateOffers : null,
      learnToTeach: matchingLearnToTeach ? matchingLearnToTeach.userOffers : null
    },
    reasons
  };
}

/**
 * Main service method to compute recommendations
 * Attempts Python FastAPI microservice first, falls back to native algorithm seamlessly
 */
async function getRecommendations(targetProfile, candidateProfiles) {
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

  try {
    const response = await axios.post(
      `${aiServiceUrl}/recommendations`,
      {
        targetProfile,
        candidates: candidateProfiles
      },
      { timeout: 4000 }
    );

    if (response.data && response.data.recommendations) {
      console.log('[AI Service] Successfully fetched recommendations from Python FastAPI microservice');
      return response.data.recommendations;
    }
  } catch (err) {
    console.log(`[AI Service] Python FastAPI not reached (${err.message}). Using high-fidelity native recommendation engine.`);
  }

  // Fallback / native computation
  const results = candidateProfiles.map((cand) => calculateCompatibilityNative(targetProfile, cand));
  results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  return results;
}

module.exports = {
  getRecommendations,
  calculateCompatibilityNative
};
