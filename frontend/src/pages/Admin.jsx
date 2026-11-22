import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Layers,
  MessageSquare,
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  TrendingUp,
  Award
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/users?search=${encodeURIComponent(userSearch)}`),
        api.get('/admin/reports')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (reportsRes.data.success) setReports(reportsRes.data.reports);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userSearch]);

  const handleToggleSuspend = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/suspend`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isSuspended: res.data.isSuspended } : u))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleUpdateReport = async (reportId, status, actionTaken) => {
    try {
      const res = await api.put(`/admin/reports/${reportId}`, { status, actionTaken });
      if (res.data.success) {
        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? res.data.report : r))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-rose-400" />
            <h1 className="text-2xl font-extrabold tracking-tight">
              SkillSync Platform Administration
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            SRS Requirement R8: Platform monitoring, student account oversight, and content moderation
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
            Administrator: {user?.name}
          </span>
        </div>
      </div>

      {/* Aggregate Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Registered Users</span>
              <Users className="h-4 w-4 text-brand-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {stats.users?.total || 0}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {stats.users?.suspended || 0} suspended
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Exchange Requests</span>
              <Layers className="h-4 w-4 text-violet-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {stats.exchanges?.total || 0}
            </p>
            <span className="text-[11px] text-emerald-500 font-semibold mt-1 block">
              {stats.exchanges?.completed || 0} completed successfully
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Messages Delivered</span>
              <MessageSquare className="h-4 w-4 text-sky-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {stats.engagement?.totalMessages || 0}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">Socket.IO real-time delivery</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Moderation</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {stats.engagement?.pendingReports || 0}
            </p>
            <span className="text-[11px] text-amber-500 font-semibold mt-1 block">
              Reports requiring review
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`text-xs px-4 py-2 rounded-xl font-medium transition ${
            activeTab === 'users'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          User Accounts & Access ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`text-xs px-4 py-2 rounded-xl font-medium transition flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Safety & Incident Reports</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-mono">
            {reports.length}
          </span>
        </button>
      </div>

      {/* Tab 1: User Management Table */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Student Directory & Account Status
            </h3>
            <div className="w-64">
              <Input
                icon={Search}
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-2">Student</th>
                  <th className="py-3 px-2">College / Department</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Joined Date</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                          alt={u.name}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                      <span>{u.profile?.college || 'Campus'}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {u.profile?.department || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={u.role === 'admin' ? 'danger' : 'default'} size="sm">
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      {u.isSuspended ? (
                        <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          <span>Suspended</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      {u.role !== 'admin' && (
                        <Button
                          size="sm"
                          variant={u.isSuspended ? 'secondary' : 'outline'}
                          className={u.isSuspended ? 'text-emerald-600' : 'text-rose-500'}
                          onClick={() => handleToggleSuspend(u._id)}
                        >
                          {u.isSuspended ? 'Reactivate' : 'Suspend'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Reports & Moderation Table */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Incident Reports & Content Flags
          </h3>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No active reports in the moderation queue. Platform integrity is healthy!
            </p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep._id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181a24] border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" size="sm">
                        {rep.reason}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        Reported Student: {rep.reportedUser?.name} ({rep.reportedUser?.email})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Details: "{rep.details}"
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Reported by: {rep.reporter?.name} · Status: {rep.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleUpdateReport(rep._id, 'resolved', 'Reviewed by admin')}
                    >
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateReport(rep._id, 'dismissed', 'Dismissed as non-infringing')}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleToggleSuspend(rep.reportedUser?._id)}
                    >
                      Suspend User
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
