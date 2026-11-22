import React, { useState, useEffect } from 'react';
import {
  User,
  Plus,
  Trash2,
  Save,
  Star,
  School,
  BookOpen,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import RatingStars from '../components/common/RatingStars';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    college: '',
    department: '',
    academicYear: '3rd Year',
    headline: '',
    bio: '',
    avatar: '',
    preferredMode: 'online',
    location: '',
    interests: '',
    availability: ''
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Modals for adding skills
  const [showAddTeachModal, setShowAddTeachModal] = useState(false);
  const [teachSkillInput, setTeachSkillInput] = useState({
    skillName: '',
    category: 'Programming & Tech',
    proficiencyLevel: 4,
    description: ''
  });

  const [showAddLearnModal, setShowAddLearnModal] = useState(false);
  const [learnSkillInput, setLearnSkillInput] = useState({
    skillName: '',
    category: 'Programming & Tech',
    targetProficiency: 4,
    priority: 'high'
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        college: profile.college || '',
        department: profile.department || '',
        academicYear: profile.academicYear || '3rd Year',
        headline: profile.headline || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        preferredMode: profile.preferredMode || 'online',
        location: profile.location || '',
        interests: (profile.interests || []).join(', '),
        availability: (profile.availability || []).join(', ')
      });
    }

    if (user?.id) {
      api.get(`/reviews/user/${user.id}`).then((res) => {
        if (res.data.success) {
          setReviews(res.data.reviews || []);
        }
      }).catch(() => {});
    }
  }, [profile, user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await api.put('/profiles/me', {
        ...formData,
        interests: formData.interests
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean),
        availability: formData.availability
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean)
      });
      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTeachSkill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/profiles/skills/teach', teachSkillInput);
      await refreshProfile();
      setShowAddTeachModal(false);
      setTeachSkillInput({ skillName: '', category: 'Programming & Tech', proficiencyLevel: 4, description: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleRemoveTeachSkill = async (skillName) => {
    try {
      await api.delete(`/profiles/skills/teach/${encodeURIComponent(skillName)}`);
      await refreshProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove skill');
    }
  };

  const handleAddLearnSkill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/profiles/skills/learn', learnSkillInput);
      await refreshProfile();
      setShowAddLearnModal(false);
      setLearnSkillInput({ skillName: '', category: 'Programming & Tech', targetProficiency: 4, priority: 'high' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add goal');
    }
  };

  const handleRemoveLearnSkill = async (skillName) => {
    try {
      await api.delete(`/profiles/skills/learn/${encodeURIComponent(skillName)}`);
      await refreshProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove goal');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Manage Student Profile
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Keep your skills, availability, and learning preferences up-to-date for optimal AI matches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved!</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Basic Info & Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleProfileSubmit} className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4 text-brand-500" />
              <span>Academic & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="College / University"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                required
              />
              <Input
                label="Department / Field"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year
                </label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-3 py-2"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Exchange Mode
                </label>
                <select
                  value={formData.preferredMode}
                  onChange={(e) => setFormData({ ...formData, preferredMode: e.target.value })}
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-3 py-2"
                >
                  <option value="online">Online (Video & Screen Share)</option>
                  <option value="in-person">In-Person (Campus)</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <Input
              label="Headline (Short summary for cards)"
              value={formData.headline}
              placeholder="e.g. 3rd-year Python enthusiast eager to learn Figma UI/UX"
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Bio & Background
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your learning interests, coding experience, and exchange goals..."
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <Input
              label="Profile Picture URL"
              value={formData.avatar}
              placeholder="https://..."
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Interests (Comma separated)"
                placeholder="AI, Hackathons, Design, Cloud"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              />
              <Input
                label="Availability Slots (Comma separated)"
                placeholder="Weekends, Weekdays Evenings"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="sm" loading={saving} icon={Save}>
                Save Profile Changes
              </Button>
            </div>
          </form>

          {/* Reviews Received Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span>Reviews & Feedback ({reviews.length})</span>
              </h3>
              <RatingStars value={profile?.averageRating || 5.0} count={profile?.totalReviews || 0} size="sm" />
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">
                No reviews yet. Complete your first skill exchange to receive verified peer feedback!
              </p>
            ) : (
              <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
                {reviews.map((r) => (
                  <div key={r._id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {r.reviewer?.name || 'Peer Student'}
                      </span>
                      <RatingStars value={r.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      "{r.comment}"
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Skill taught: {r.skillTaught || 'General Exchange'} · {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Skills Inventory Managers */}
        <div className="space-y-6">
          {/* Skills You Can Teach */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span>Skills You Teach</span>
              </h3>
              <Button size="sm" variant="outline" icon={Plus} onClick={() => setShowAddTeachModal(true)}>
                Add
              </Button>
            </div>

            {profile?.teachSkills?.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                You haven't added any skills to teach yet. Click "Add" above!
              </p>
            ) : (
              <div className="space-y-2">
                {profile?.teachSkills?.map((s) => (
                  <div
                    key={s.skillName}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                        {s.skillName}
                      </h4>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Level {s.proficiencyLevel}/5 Proficiency
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeachSkill(s.skillName)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills You Want to Learn */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-violet-500" />
                <span>Skills You Want</span>
              </h3>
              <Button size="sm" variant="outline" icon={Plus} onClick={() => setShowAddLearnModal(true)}>
                Add
              </Button>
            </div>

            {profile?.learnSkills?.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                Add skills you are eager to learn from campus peers!
              </p>
            ) : (
              <div className="space-y-2">
                {profile?.learnSkills?.map((s) => (
                  <div
                    key={s.skillName}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                        {s.skillName}
                      </h4>
                      <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold capitalize">
                        Target: Level {s.targetProficiency}/5 · {s.priority} priority
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLearnSkill(s.skillName)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Teach Skill Modal */}
      <Modal
        isOpen={showAddTeachModal}
        onClose={() => setShowAddTeachModal(false)}
        title="Add Skill You Can Teach"
        description="List a skill you can mentor peers in with your proficiency level (1-5)"
      >
        <form onSubmit={handleAddTeachSkill} className="space-y-4">
          <Input
            label="Skill Name"
            placeholder="e.g. Python, Figma, React.js, C++"
            value={teachSkillInput.skillName}
            onChange={(e) => setTeachSkillInput({ ...teachSkillInput, skillName: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Proficiency Level (1: Beginner, 5: Expert)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="5"
                value={teachSkillInput.proficiencyLevel}
                onChange={(e) => setTeachSkillInput({ ...teachSkillInput, proficiencyLevel: Number(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs font-bold text-brand-600 w-8 text-center font-mono">
                {teachSkillInput.proficiencyLevel}/5
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddTeachModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Teaching Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Learn Skill Modal */}
      <Modal
        isOpen={showAddLearnModal}
        onClose={() => setShowAddLearnModal(false)}
        title="Add Skill You Want to Learn"
        description="Specify a new topic or tool you want a peer to teach you"
      >
        <form onSubmit={handleAddLearnSkill} className="space-y-4">
          <Input
            label="Skill Name"
            placeholder="e.g. UI/UX Design, Cloud Computing, Docker"
            value={learnSkillInput.skillName}
            onChange={(e) => setLearnSkillInput({ ...learnSkillInput, skillName: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Proficiency
              </label>
              <select
                value={learnSkillInput.targetProficiency}
                onChange={(e) => setLearnSkillInput({ ...learnSkillInput, targetProficiency: Number(e.target.value) })}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-3 py-2"
              >
                <option value="3">Level 3 (Intermediate)</option>
                <option value="4">Level 4 (Advanced)</option>
                <option value="5">Level 5 (Mastery)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={learnSkillInput.priority}
                onChange={(e) => setLearnSkillInput({ ...learnSkillInput, priority: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-3 py-2"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddLearnModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Learning Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
