import React from 'react';
import { Bell, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export default function Toast() {
  const { toastNotification, dismissToast } = useNotifications();
  const navigate = useNavigate();

  if (!toastNotification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white dark:bg-[#181a24] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xl shadow-brand-500/10 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400 mt-0.5">
          <Bell className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {toastNotification.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
            {toastNotification.message}
          </p>
          {toastNotification.link && (
            <button
              onClick={() => {
                dismissToast();
                navigate(toastNotification.link);
              }}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
            >
              <span>View details</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
