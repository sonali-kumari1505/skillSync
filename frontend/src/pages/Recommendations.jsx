import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Brain,
  Filter,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import CompatibilityBadge from '../components/common/CompatibilityBadge';
import RatingStars from '../components/common/RatingStars';
import RequestModal from '../components/common/RequestModal';

export default function Recommendations() {
  const { user, profile } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(50);
  const [selectedMatchForRequest, setSelectedMatchForRequest] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/recommendations?minScore=${minScore}`);
        if (res.data.success) {
          setRecommendations(res.data.recommendations || []);
        }
      } catch (err) {
        console.error('Failed to load AI recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [minScore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900/20 via-violet-900/10 to-transparent border border-brand-500/20 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
            <Brain className="h-3.5 w-3.5" />
            <span>AI Reciprocal Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Personalized Skill Matches for {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Our recommendation model computes bilateral compatibility using TF-IDF n-gram vectorization,
            proficiency equilibrium, and schedule overlap to pair you with high-reciprocity learning partners.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Filter Confidence:
          </span>
          <div className="flex items-center gap-1">
            {[
              { label: 'All Matches (50%+)', val: 50 },
              { label: 'High Potential (70%+)', val: 70 },
              { label: 'Exceptional (85%+)', val: 85 }
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setMinScore(tab.val)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  minScore === tab.val
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {recommendations.length} ranked candidate peers
        </span>
      </div>

      {/* Recommendations Cards List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Running scikit-learn recommendation matrix across candidate vectors...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 space-y-4 max-w-xl mx-auto">
          <Brain className="h-10 w-10 text-brand-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matches above {minScore}% compatibility
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lower your filter threshold or add more teach/learn skills to your profile so the model can evaluate more semantic pairings.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setMinScore(50)}>
            View All Potential Matches
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((item, idx) => {
            const cand = item.candidateProfile;
            const score = item.compatibilityScore;

            return (
              <div
                key={cand.user?._id || idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition glow-card shadow-sm space-y-5"
              >
                {/* Top Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        cand.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${cand.user?.name}`
                      }
                      alt={cand.user?.name}
                      className="h-14 w-14 rounded-2xl object-cover shrink-0 ring-2 ring-brand-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {cand.user?.name}
                        </h3>
                        <span className="text-xs text-slate-400">· {cand.college}</span>
                        <RatingStars
                          value={cand.averageRating || 5.0}
                          count={cand.totalReviews || 0}
                          size="sm"
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {cand.headline || 'Active SkillSync Peer'}
                      </p>
                      <span className="text-[11px] font-mono text-slate-400">
                        {cand.department} · {cand.academicYear} · {cand.preferredMode}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                    <CompatibilityBadge score={score} size="lg" />
                    <span className="text-[11px] font-mono text-emerald-500 font-bold uppercase tracking-wider">
                      {item.matchType}
                    </span>
                  </div>
                </div>

                {/* Reciprocal Skills Exchange Mapping Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181a24] border border-slate-200/80 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block font-mono">
                        They Can Teach You
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                          {item.matchingSkills?.teachToLearn || cand.teachSkills?.[0]?.skillName || 'Primary Skill'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          (Matches your learning goal)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block font-mono">
                        You Can Teach Them
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-700 dark:text-violet-300 font-semibold text-xs">
                          {item.matchingSkills?.learnToTeach || cand.learnSkills?.[0]?.skillName || 'Primary Goal'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          (Matches your teaching list)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Explainability Reasons List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-mono">
                    AI Recommendation Evidence & Insights
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {item.reasons?.map((reason, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-start gap-2 text-slate-600 dark:text-slate-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Availability: {cand.availability?.join(', ') || 'Flexible'}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    icon={Send}
                    onClick={() =>
                      setSelectedMatchForRequest({
                        student: cand,
                        offeredSkill: item.matchingSkills?.learnToTeach,
                        requestedSkill: item.matchingSkills?.teachToLearn
                      })
                    }
                  >
                    Initiate Exchange Request
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Request Modal */}
      {selectedMatchForRequest && (
        <RequestModal
          isOpen={Boolean(selectedMatchForRequest)}
          onClose={() => setSelectedMatchForRequest(null)}
          targetStudent={selectedMatchForRequest.student}
          initialOfferedSkill={selectedMatchForRequest.offeredSkill}
          initialRequestedSkill={selectedMatchForRequest.requestedSkill}
        />
      )}
    </div>
  );
}
