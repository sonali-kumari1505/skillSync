import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  Circle,
  Plus,
  BookOpen,
  MessageSquare,
  Sparkles,
  Calendar,
  Save,
  Award
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

export default function Progress() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRoadmap, setActiveRoadmap] = useState(null);

  // New Milestone Modal
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');

  // New Note state
  const [noteContent, setNoteContent] = useState('');

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/progress');
      if (res.data.success) {
        setRoadmaps(res.data.roadmaps || []);
        if (res.data.roadmaps?.length > 0) {
          setActiveRoadmap(res.data.roadmaps[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleToggleMilestone = async (roadmapId, milestoneId) => {
    try {
      const res = await api.put(`/progress/${roadmapId}/milestones/${milestoneId}`);
      if (res.data.success) {
        setActiveRoadmap(res.data.progress);
        setRoadmaps((prev) =>
          prev.map((r) => (r._id === roadmapId ? res.data.progress : r))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle milestone');
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!milestoneTitle.trim() || !activeRoadmap) return;

    try {
      const res = await api.post(`/progress/${activeRoadmap._id}/milestones`, {
        title: milestoneTitle.trim(),
        description: milestoneDesc.trim()
      });
      if (res.data.success) {
        setActiveRoadmap(res.data.progress);
        setRoadmaps((prev) =>
          prev.map((r) => (r._id === activeRoadmap._id ? res.data.progress : r))
        );
        setShowAddMilestone(false);
        setMilestoneTitle('');
        setMilestoneDesc('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add milestone');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim() || !activeRoadmap) return;

    try {
      const res = await api.post(`/progress/${activeRoadmap._id}/notes`, {
        content: noteContent.trim()
      });
      if (res.data.success) {
        setActiveRoadmap(res.data.progress);
        setRoadmaps((prev) =>
          prev.map((r) => (r._id === activeRoadmap._id ? res.data.progress : r))
        );
        setNoteContent('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add note');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Learning Progress Roadmaps
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Set goals, track collaborative milestones, and document session notes with your mentors
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading learning roadmaps...
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-3">
          <Layers className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            No Active Roadmaps
          </h3>
          <p className="text-xs text-slate-400">
            Roadmaps automatically generate as soon as a skill exchange request is accepted.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Roadmaps Selector */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block font-mono">
              Your Active Roadmaps
            </span>
            {roadmaps.map((r) => {
              const isSelected = activeRoadmap?._id === r._id;
              const isStudent = r.student?._id === user?.id;

              return (
                <button
                  key={r._id}
                  onClick={() => setActiveRoadmap(r)}
                  className={`w-full p-4 rounded-2xl border text-left transition glow-card ${
                    isSelected
                      ? 'bg-white dark:bg-[#13151c] border-brand-500 shadow-md ring-1 ring-brand-500/30'
                      : 'bg-white/60 dark:bg-[#13151c]/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {r.skill}
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                      {r.progressPercentage}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {isStudent
                      ? `Mentor: ${r.mentor?.name}`
                      : `Mentee: ${r.student?.name}`}
                  </p>

                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-300"
                      style={{ width: `${r.progressPercentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column (2 Cols): Selected Roadmap Detail View */}
          {activeRoadmap && (
            <div className="lg:col-span-2 space-y-6">
              {/* Roadmap Header Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 font-bold">
                      Interactive Goal Tracker
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {activeRoadmap.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Skill Focus: <strong className="text-slate-800 dark:text-slate-200">{activeRoadmap.skill}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 font-mono">
                      {activeRoadmap.progressPercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">
                      Completion Score
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeRoadmap.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Learning Milestones</span>
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Plus}
                    onClick={() => setShowAddMilestone(true)}
                  >
                    Add Milestone
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {activeRoadmap.milestones?.map((m) => (
                    <div
                      key={m._id}
                      onClick={() => handleToggleMilestone(activeRoadmap._id, m._id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 select-none ${
                        m.completed
                          ? 'bg-emerald-500/[0.04] border-emerald-500/20 text-slate-500 dark:text-slate-400'
                          : 'bg-slate-50 dark:bg-[#181a24] border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white hover:border-brand-500/40'
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0">
                        {m.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-xs font-semibold ${
                            m.completed ? 'line-through opacity-75' : ''
                          }`}
                        >
                          {m.title}
                        </h4>
                        {m.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaborative Notes & Log */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-brand-500" />
                  <span>Shared Exchange Notes & Study Logs</span>
                </h3>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Log key takeaways, homework exercises, or session summaries..."
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" size="sm" icon={Save}>
                      Post Note
                    </Button>
                  </div>
                </form>

                <div className="space-y-2 pt-2 divide-y divide-slate-100 dark:divide-slate-800">
                  {activeRoadmap.notes?.map((n) => (
                    <div key={n._id} className="pt-2.5 first:pt-0 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {n.author?.name || 'Participant'}
                        </span>
                        <span className="font-mono">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Milestone Modal */}
      <Modal
        isOpen={showAddMilestone}
        onClose={() => setShowAddMilestone(false)}
        title="Add Learning Milestone"
        description="Define a new goal or checkpoint for this skill roadmap"
      >
        <form onSubmit={handleAddMilestone} className="space-y-4">
          <Input
            label="Milestone Title"
            placeholder="e.g. Master React Hooks & useEffect"
            value={milestoneTitle}
            onChange={(e) => setMilestoneTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={milestoneDesc}
              onChange={(e) => setMilestoneDesc(e.target.value)}
              placeholder="Outline specific exercises or criteria for completing this step..."
              className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddMilestone(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Milestone
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
