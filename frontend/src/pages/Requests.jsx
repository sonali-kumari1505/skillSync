import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  Layers,
  ArrowRight,
  Send,
  Inbox,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ReviewModal from '../components/common/ReviewModal';

export default function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedExchangeForReview, setSelectedExchangeForReview] = useState(null);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/requests');
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.put(`/requests/${id}/status`, { status });
      if (res.data.success) {
        fetchRequests();
        if (status === 'accepted') {
          navigate('/chat');
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request status');
    }
  };

  // Filter requests according to tab
  const filteredRequests = requests.filter((r) => {
    const isReceiver = r.receiver?._id === user?.id;
    const isSender = r.sender?._id === user?.id;

    if (activeTab === 'incoming') return isReceiver && r.status === 'pending';
    if (activeTab === 'outgoing') return isSender && r.status === 'pending';
    if (activeTab === 'active') return r.status === 'accepted';
    if (activeTab === 'completed') return r.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Skill Exchange Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track, accept, and coordinate your collaborative peer learning exchanges
          </p>
        </div>

        <Link to="/explore">
          <Button variant="primary" size="sm" icon={Send}>
            Browse More Peers
          </Button>
        </Link>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'all', label: 'All Exchanges' },
          { id: 'incoming', label: 'Pending Incoming' },
          { id: 'outgoing', label: 'Pending Outgoing' },
          { id: 'active', label: 'Active Ongoing' },
          { id: 'completed', label: 'Completed' }
        ].map((tab) => {
          const count = requests.filter((r) => {
            if (tab.id === 'incoming') return r.receiver?._id === user?.id && r.status === 'pending';
            if (tab.id === 'outgoing') return r.sender?._id === user?.id && r.status === 'pending';
            if (tab.id === 'active') return r.status === 'accepted';
            if (tab.id === 'completed') return r.status === 'completed';
            return true;
          }).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id
                  ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading exchange requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-3">
          <Inbox className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            No requests in this view
          </h3>
          <p className="text-xs text-slate-400">
            Explore peers to initiate a new reciprocal skill exchange.
          </p>
          <Link to="/explore">
            <Button size="sm" variant="secondary">
              Explore Students
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isSender = req.sender?._id === user?.id;
            const partner = isSender ? req.receiver : req.sender;

            return (
              <div
                key={req._id}
                className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 glow-card"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${partner?.name}`}
                      alt={partner?.name}
                      className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {partner?.name}
                        </h3>
                        <Badge
                          variant={
                            req.status === 'accepted'
                              ? 'success'
                              : req.status === 'pending'
                              ? 'warning'
                              : req.status === 'completed'
                              ? 'info'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {req.status.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {isSender ? 'Outgoing Request' : 'Incoming Request'} · {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Skills Exchange Pill */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-100 dark:border-slate-800/80 inline-flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Offered Skill:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {req.offeredSkill}
                    </span>
                    <span className="text-slate-400">⇄</span>
                    <span className="text-slate-500 dark:text-slate-400">Requested Skill:</span>
                    <span className="font-semibold text-violet-600 dark:text-violet-400">
                      {req.requestedSkill}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px] ml-2">
                      ({req.proposedSchedule} · {req.learningMode})
                    </span>
                  </div>

                  {req.initialMessage && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                      "{req.initialMessage}"
                    </p>
                  )}
                </div>

                {/* Actions per Status */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Incoming Pending Actions */}
                  {!isSender && req.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        icon={CheckCircle}
                        onClick={() => handleUpdateStatus(req._id, 'accepted')}
                      >
                        Accept & Unlock Chat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={XCircle}
                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  {/* Outgoing Pending Actions */}
                  {isSender && req.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-500"
                      onClick={() => handleUpdateStatus(req._id, 'cancelled')}
                    >
                      Cancel Request
                    </Button>
                  )}

                  {/* Accepted Ongoing Actions */}
                  {req.status === 'accepted' && (
                    <>
                      <Link to="/chat">
                        <Button size="sm" variant="primary" icon={MessageSquare}>
                          Open Chat
                        </Button>
                      </Link>
                      <Link to="/progress">
                        <Button size="sm" variant="outline" icon={Layers}>
                          View Roadmap
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUpdateStatus(req._id, 'completed')}
                      >
                        Mark Completed
                      </Button>
                    </>
                  )}

                  {/* Completed Actions */}
                  {req.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Star}
                      onClick={() => setSelectedExchangeForReview(req)}
                    >
                      Write Review
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedExchangeForReview && (
        <ReviewModal
          isOpen={Boolean(selectedExchangeForReview)}
          onClose={() => setSelectedExchangeForReview(null)}
          exchangeRequest={selectedExchangeForReview}
          onSuccess={() => {
            fetchRequests();
          }}
        />
      )}
    </div>
  );
}
