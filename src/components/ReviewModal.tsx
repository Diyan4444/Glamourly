"use client";

import React, { useState } from "react";
import { Star, X, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ReviewModalProps {
  salonId: string;
  salonName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({
  salonId,
  salonName,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const { user } = useAuth();
  // All hooks MUST be called before any early return
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState(user?.name || "");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Early return AFTER all hooks
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      setError("Please fill out your name and review feedback.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId,
          userName: userName.trim(),
          rating,
          comment: comment.trim(),
          customerId: user?.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1800);
      } else {
        setError(data.error || "Failed to submit review.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 p-6">
        <div className="flex justify-between items-center pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Write a Review</h3>
            <p className="text-xs text-stone-500">{salonName}</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-stone-900">Thank You!</h4>
            <p className="text-xs text-stone-500">Your review has been published successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {error}
              </div>
            )}

            {/* Star Rating Picker */}
            <div className="text-center py-2 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-xs text-stone-500 block mb-1">Your Rating</span>
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-stone-700 mt-1 block">
                {rating === 5 && "⭐ Excellent - Highly Recommended!"}
                {rating === 4 && "⭐ Great experience"}
                {rating === 3 && "⭐ Average"}
                {rating === 2 && "⭐ Below expectation"}
                {rating === 1 && "⭐ Poor"}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Shah"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Your Review</label>
              <textarea
                rows={3}
                required
                placeholder="How was the haircut, stylist hospitality, and cleanliness?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold px-4 py-2 text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Post Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
