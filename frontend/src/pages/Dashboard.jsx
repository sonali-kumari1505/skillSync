import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Users,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  Star,
  Send,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import CompatibilityBadge from '../components/common/CompatibilityBadge';
import RequestModal from '../components/common/RequestModal';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentForRequest, setSelectedStudentForRequest] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [recRes, reqRes, progRes] = await Promise.all([
          api.get('/recommendations?minScore=50').catch(() => ({ data: { recommendations: [] } })),
          api.get('/requests').catch(() => ({ data: { requests: [] } })),
          api.get('/progress').catch(() => ({ data: { roadmaps: [] } }))
        ]);

        setRecommendations(recRes.data.recommendations || []);
        setRequests(reqRes.data.requests || []);
        setRoadmaps(progRes.data.roadmaps || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 20;
    let score = 20; // base for registration
    if (profile.college && profile.department) score += 15;
    if (profile.headline && profile.bio) score += 15;
    if (profile.teachSkills && profile.teachSkills.length > 0) score += 20;
    if (profile.learnSkills && profile.learnSkills.length > 0) score += 15;
    if (profile.interests && profile.interests.length > 0) score += 15;
    return Math.min(100, score);
  };

  const completionPct = calculateProfileCompletion();
  const pendingIncoming = requests.filter((r) => r.receiver?._id === user?.id && r.status === 'pending');
  const activeExchanges = requests.filter((r) => r.status === 'accepted');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <Badge variant="primary" size="sm">
              {profile?.academicYear || 'Student'}
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {profile?.college} · {profile?.department}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/recommendations">
            <Button variant="primary" size="sm" icon={Sparkles}>
              Find AI Matches
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" size="sm">
              Manage Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Completion Bar (if < 100%) */}
      {completionPct < 100 && (
        <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                Profile Strength: {completionPct}%
              </span>
              <span className="text-[10px] text-slate-500">
                (Add more skills & interests to boost AI matching accuracy)
              </span>
            </div>
            <div className="w-64 sm:w-80 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
          <Link to="/profile">
            <Button variant="secondary" size="sm">
              Complete Profile
            </Button>
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Exchanges</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {activeExchanges.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Ongoing bilateral sessions</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {pendingIncoming.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting your response</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Skills Offered / Wanted</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {profile?.teachSkills?.length || 0} / {profile?.learnSkills?.length || 0}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Listed in your inventory</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average Rating</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {profile?.averageRating ? Number(profile.averageRating).toFixed(1) : '5.0'} ⭐
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">{profile?.totalReviews || 0} peer reviews</span>
        </div>
      </div>

      {/* Main Grid: AI Recommendations on Left, Active Exchanges & Requests on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): AI Recommended Peer Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Top AI Reciprocal Matches
              </h2>
            </div>
            <Link
              to="/recommendations"
              className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all matches</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-[#13151c] rounded-2xl border border-slate-200 dark:border-slate-800">
              Calculating bilateral compatibility scores...
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#13151c] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs text-slate-500">
                No high-confidence matches found yet. Add more teach and learn skills to your profile to trigger the AI engine!
              </p>
              <Link to="/profile">
                <Button size="sm" variant="secondary">
                  Update Skills
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((item, idx) => {
                const cand = item.candidateProfile;
                return (
                  <div
                    key={cand.user?._id || idx}
                    className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition glow-card"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={
                            cand.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${cand.user?.name}`
                          }
                          alt={cand.user?.name}
                          className="h-12 w-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {cand.user?.name}
                            </h3>
                            <span className="text-[10px] text-slate-400">
                              · {cand.college}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {cand.headline || 'Peer skill learner'}
                          </p>

                          {/* Matching Skills Breakdown */}
                          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                              Teaches: {item.matchingSkills?.teachToLearn || cand.teachSkills?.[0]?.skillName || 'Skills'}
                            </span>
                            <span className="text-slate-400">⇄</span>
                            <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium">
                              Learns: {item.matchingSkills?.learnToTeach || cand.learnSkills?.[0]?.skillName || 'Skills'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <CompatibilityBadge score={item.compatibilityScore} />
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="primary"
                            icon={Send}
                            onClick={() => setSelectedStudentForRequest(cand)}
                          >
                            Exchange
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Explainable Match Reason */}
                    {item.reasons && item.reasons.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-brand-500 shrink-0" />
                        <span className="line-clamp-1">{item.reasons[0]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Active Roadmaps & Quick Requests */}
        <div className="space-y-6">
          {/* Active Learning Roadmaps */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-brand-500" />
                <span>Learning Roadmaps</span>
              </h2>
              <Link to="/progress" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                View all
              </Link>
            </div>

            {roadmaps.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">
                No active roadmaps yet. Roadmaps automatically generate once an exchange request is accepted!
              </p>
            ) : (
              <div className="space-y-3">
                {roadmaps.slice(0, 3).map((r) => (
                  <div
                    key={r._id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-100 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {r.skill}
                      </span>
                      <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">
                        {r.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all"
                        style={{ width: `${r.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Chat Shortcut Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-600/10 via-violet-500/5 to-transparent border border-brand-500/20 space-y-3">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-bold text-sm">Real-Time Peer Chat</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Collaborate and coordinate sessions with accepted exchange partners in real-time.
            </p>
            <Link to="/chat" className="block pt-1">
              <Button size="sm" variant="primary" className="w-full" icon={ArrowRight}>
                Open Chat Room
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {selectedStudentForRequest && (
        <RequestModal
          isOpen={Boolean(selectedStudentForRequest)}
          onClose={() => setSelectedStudentForRequest(null)}
          targetStudent={selectedStudentForRequest}
          onSuccess={() => {
            // refresh data
            api.get('/requests').then((res) => setRequests(res.data.requests || []));
          }}
        />
      )}
    </div>
  );
}
