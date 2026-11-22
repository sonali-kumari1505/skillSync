import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RequestModal({
  isOpen,
  onClose,
  targetStudent,
  initialOfferedSkill,
  initialRequestedSkill,
  onSuccess
}) {
  const { profile } = useAuth();
  const [offeredSkill, setOfferedSkill] = useState(initialOfferedSkill || '');
  const [requestedSkill, setRequestedSkill] = useState(initialRequestedSkill || '');
  const [initialMessage, setInitialMessage] = useState(
    'Hi! I saw your profile and would love to arrange a skill exchange with you.'
  );
  const [proposedSchedule, setProposedSchedule] = useState('Weekends (2 hours)');
  const [learningMode, setLearningMode] = useState('online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-fill suggested default skills when modal opens
  React.useEffect(() => {
    if (initialOfferedSkill) {
      setOfferedSkill(initialOfferedSkill);
    } else if (profile?.teachSkills?.length > 0) {
      setOfferedSkill(profile.teachSkills[0].skillName);
    }

    if (initialRequestedSkill) {
      setRequestedSkill(initialRequestedSkill);
    } else if (targetStudent?.teachSkills?.length > 0) {
      setRequestedSkill(targetStudent.teachSkills[0].skillName);
    }
  }, [initialOfferedSkill, initialRequestedSkill, profile, targetStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!offeredSkill || !requestedSkill) {
      setError('Please specify both the skill you offer and the skill you want to learn.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/requests', {
        receiverId: targetStudent.user?._id || targetStudent.user,
        offeredSkill,
        requestedSkill,
        initialMessage,
        proposedSchedule,
        learningMode
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          if (onSuccess) onSuccess(res.data.request);
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to send exchange request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!targetStudent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Initiate Skill Exchange Request"
      description={`Propose a bilateral knowledge exchange with ${
        targetStudent.user?.name || 'this student'
      }`}
    >
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">
            Request Sent Successfully!
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {targetStudent.user?.name} has been notified and can accept to unlock real-time chat.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-200/80 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Skill You Will Teach
              </label>
              {profile?.teachSkills?.length > 0 ? (
                <select
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-2.5 py-2 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select one of your skills...</option>
                  {profile.teachSkills.map((s) => (
                    <option key={s.skillName} value={s.skillName}>
                      {s.skillName} (Level {s.proficiencyLevel}/5)
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  placeholder="e.g. Python, UI/UX"
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Skill You Want to Learn
              </label>
              {targetStudent.teachSkills?.length > 0 ? (
                <select
                  value={requestedSkill}
                  onChange={(e) => setRequestedSkill(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-2.5 py-2 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select their offered skill...</option>
                  {targetStudent.teachSkills.map((s) => (
                    <option key={s.skillName} value={s.skillName}>
                      {s.skillName} (Level {s.proficiencyLevel}/5)
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  placeholder="e.g. React.js, Figma"
                  value={requestedSkill}
                  onChange={(e) => setRequestedSkill(e.target.value)}
                  required
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Proposed Schedule
              </label>
              <select
                value={proposedSchedule}
                onChange={(e) => setProposedSchedule(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-3 py-2"
              >
                <option value="Weekends (2 hours)">Weekends (2 hours)</option>
                <option value="Weekdays Evenings (1 hour)">Weekdays Evenings (1 hour)</option>
                <option value="Twice a week (30 mins)">Twice a week (30 mins)</option>
                <option value="Flexible / As Needed">Flexible / As Needed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Learning Mode
              </label>
              <select
                value={learningMode}
                onChange={(e) => setLearningMode(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-3 py-2"
              >
                <option value="online">Online (Google Meet / Zoom)</option>
                <option value="in-person">In-Person (Campus Library / Lab)</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Personalized Introduction & Goals
            </label>
            <textarea
              rows={3}
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Introduce yourself and outline your learning objectives..."
              className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              icon={Send}
            >
              Send Exchange Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
