'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Star, User, Send, Trash2, Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useScopedI18n } from '../../locales/client';

interface ReviewSectionProps {
  escortId: string;
  adId: number;
  city: string;
}

interface Review {
  id: string;
  escort_id: string;
  ad_id: number;
  user_id: string;
  rating: number;
  comment: string;
  city: string;
  anonymous: boolean;
  created_at: string;
  users?: {
    username: string;
  };
}

export default function ReviewSection({ escortId, adId, city }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    anonymous: false
  });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });

  const t = useScopedI18n('ReviewSection' as never) as (key: string, vars?: Record<string, any>) => string;

  useEffect(() => {
    fetchReviews();
  }, [escortId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?escort_id=${escortId}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error(t('messages.error.fetch'), error);
      // Fallback: récupérer depuis Supabase directement
      const supabase = createClient();
      const { data } = await supabase
        .from('reviews')
        .select('*, profiles(username)')
        .eq('escort_id', escortId)
        .order('created_at', { ascending: false });
        
      setReviews(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (newReview.rating < 1 || newReview.rating > 5) {
      toast.error(t('messages.validation.ratingRequired'));
      return;
    }
    
    if (newReview.comment.trim().length < 10) {
      toast.error(t('form.commentMinLength'));
      return;
    }
    
    if (newReview.comment.trim().length > 500) {
      toast.error(t('form.commentMaxLength'));
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          escort_id: escortId,
          ad_id: adId,
          rating: newReview.rating,
          comment: newReview.comment.trim(),
          city: city,
          anonymous: newReview.anonymous
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNewReview({ rating: 5, comment: '', anonymous: false });
        fetchReviews();
        toast.success(t('messages.success.published'));
      } else {
        toast.error(`${t('messages.error.generic')}: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error(t('messages.error.publish'), error);
      toast.error(t('messages.error.publish'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm(t('actions.confirmDelete'))) return;
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchReviews();
        toast.success(t('messages.success.deleted'));
      } else {
        toast.error(`${t('messages.error.generic')}: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error(t('messages.error.delete'), error);
      toast.error(t('messages.error.delete'));
    }
  };

  const handleEditReview = async (reviewId: string) => {
    // Validation
    if (editForm.comment.trim().length < 10) {
      toast.error(t('form.commentMinLength'));
      return;
    }
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: editForm.rating,
          comment: editForm.comment.trim()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEditingReviewId(null);
        fetchReviews();
        toast.success(t('messages.success.updated'));
      } else {
        toast.error(`${t('messages.error.generic')}: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error(t('messages.error.update'), error);
      toast.error(t('messages.error.update'));
    }
  };

  const startEditing = (review: Review) => {
    setEditingReviewId(review.id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditForm({ rating: 5, comment: '' });
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-pink-500" />
          {t('title')} ({reviews.length})
        </h2>
      </div>

      {/* Formulaire d'avis */}
      <form onSubmit={handleSubmitReview} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('form.ratingLabel')}</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewReview({...newReview, rating: star})}
                className="p-1"
                title={`${star} ${t(`stars.${star === 1 ? 'oneStar' : star === 2 ? 'twoStars' : star === 3 ? 'threeStars' : star === 4 ? 'fourStars' : 'fiveStars'}`)}`}
              >
                <Star 
                  className={`w-6 h-6 ${
                    star <= newReview.rating 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            placeholder={t('form.commentPlaceholder')}
            className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={3}
            required
            minLength={10}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 text-right mt-1">
            {newReview.comment.length}/500 {t('form.characters')}
          </div>
        </div>
      
        <button
          type="submit"
          disabled={submitting || newReview.comment.length < 10}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {t('form.publishing')}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {t('form.publish')}
            </>
          )}
        </button>
      </form>

      {/* Liste des avis */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">{t('reviews.loading')}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('reviews.empty')}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-700/50 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {review.anonymous ? t('reviews.anonymous') : review.users?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('reviews.dateFormat')} {new Date(review.created_at).toLocaleDateString()} {t('reviews.citySeparator')} {review.city}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Boutons d'action pour l'utilisateur connecté */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(review)}
                      className="p-1 text-gray-400 hover:text-blue-400"
                      title={t('actions.edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-1 text-gray-400 hover:text-red-400"
                      title={t('actions.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Édition d'avis */}
              {editingReviewId === review.id ? (
                <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditForm({...editForm, rating: star})}
                        className="p-1"
                        title={`${star} ${t(`stars.${star === 1 ? 'oneStar' : star === 2 ? 'twoStars' : star === 3 ? 'threeStars' : star === 4 ? 'fourStars' : 'fiveStars'}`)}`}
                      >
                        <Star 
                          className={`w-5 h-5 ${
                            star <= editForm.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={editForm.comment}
                    onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    rows={2}
                    minLength={10}
                    maxLength={500}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditReview(review.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      <Check className="w-3 h-3 inline mr-1" />
                      {t('actions.validate')}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                    >
                      <X className="w-3 h-3 inline mr-1" />
                      {t('actions.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}