import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  School,
  BookOpen,
  Star,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import RatingStars from '../components/common/RatingStars';
import RequestModal from '../components/common/RequestModal';

export default function Explore() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState('');
  const [selectedStudentForRequest, setSelectedStudentForRequest] = useState(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (collegeFilter) params.append('college', collegeFilter);
      if (modeFilter) params.append('mode', modeFilter);
      if (minRatingFilter) params.append('minRating', minRatingFilter);

      const res = await api.get(`/profiles?${params.toString()}`);
      if (res.data.success) {
        setProfiles(res.data.profiles);
      }
    } catch (err) {
      console.error('Failed to fetch student profiles:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, collegeFilter, modeFilter, minRatingFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProfiles();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchProfiles]);

  const clearFilters = () => {
    setSearchQuery('');
    setCollegeFilter('');
    setModeFilter('');
    setMinRatingFilter('');
  };

  const hasActiveFilters = Boolean(
    searchQuery || collegeFilter || modeFilter || minRatingFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Explore Peer Students
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Discover fellow students across colleges offering skills you want to learn
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} icon={X}>
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            icon={Search}
            placeholder="Search by skill, name, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Colleges & Universities</option>
            <option value="Delhi Technological University">Delhi Technological University</option>
            <option value="IIT Bombay">IIT Bombay</option>
            <option value="BITS Pilani">BITS Pilani</option>
            <option value="NIT Trichy">NIT Trichy</option>
            <option value="UC Berkeley">UC Berkeley</option>
            <option value="Sorbonne University">Sorbonne University</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Any Learning Mode</option>
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            value={minRatingFilter}
            onChange={(e) => setMinRatingFilter(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13151c] text-slate-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars ⭐</option>
            <option value="4.0">4.0+ Stars ⭐</option>
            <option value="3.0">3.0+ Stars ⭐</option>
          </select>
        </div>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading student profiles...
        </div>
      ) : profiles.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#13151c] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            No students found matching your criteria.
          </p>
          <p className="text-xs text-slate-400">
            Try adjusting your search query or clear filters to see more results.
          </p>
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((p) => (
            <div
              key={p._id}
              className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition flex flex-col justify-between glow-card"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        p.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${p.user?.name}`
                      }
                      alt={p.user?.name}
                      className="h-12 w-12 rounded-2xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-800"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {p.user?.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {p.college}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {p.department} · {p.academicYear}
                      </span>
                    </div>
                  </div>

                  <RatingStars
                    value={p.averageRating || 5.0}
                    count={p.totalReviews || 0}
                    size="sm"
                  />
                </div>

                {/* Headline / Bio */}
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {p.headline || p.bio || 'Eager to exchange knowledge and collaborate.'}
                </p>

                {/* Skills Can Teach */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Can Teach
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {p.teachSkills?.slice(0, 3).map((s) => (
                      <span
                        key={s.skillName}
                        className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium"
                      >
                        {s.skillName}{' '}
                        <span className="text-[9px] opacity-75">
                          (L{s.proficiencyLevel})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Want to Learn */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Wants to Learn
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {p.learnSkills?.slice(0, 3).map((s) => (
                      <span
                        key={s.skillName}
                        className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-medium"
                      >
                        {s.skillName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 capitalize flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{p.preferredMode}</span>
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  icon={Send}
                  onClick={() => setSelectedStudentForRequest(p)}
                >
                  Exchange
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {selectedStudentForRequest && (
        <RequestModal
          isOpen={Boolean(selectedStudentForRequest)}
          onClose={() => setSelectedStudentForRequest(null)}
          targetStudent={selectedStudentForRequest}
        />
      )}
    </div>
  );
}
