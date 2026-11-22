import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import RatingStars from './RatingStars';
import api from '../../services/api';
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ReviewModal({
  isOpen,
  onClose,
  exchangeRequest,
  onSuccess
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating < 1 || rating > 5) {
      setError('Please provide a star rating between 1 and 5.');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter feedback regarding your exchange experience.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reviews', {
        exchangeRequestId: exchangeRequest._id,
        rating,
        comment
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          if (onSuccess) onSuccess(res.data.review);
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit review. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!exchangeRequest) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Skill Exchange Review"
      description={`Share your feedback on your completed exchange (${exchangeRequest.offeredSkill} ⇄ ${exchangeRequest.requestedSkill})`}
    >
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">
            Review Submitted!
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thank you for helping build a trustworthy peer community.
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

          <div className="text-center py-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              How would you rate this peer mentor / learner?
            </label>
            <div className="flex justify-center">
              <RatingStars value={rating} onChange={setRating} size="lg" />
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              {rating === 5
                ? 'Outstanding Knowledge & Guidance!'
                : rating === 4
                ? 'Very Helpful & Cooperative'
                : rating === 3
                ? 'Good Experience'
                : 'Needs Improvement'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Written Feedback & Review
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you learn? How clear was the guidance? What went well?"
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
              icon={Star}
            >
              Post Review
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
