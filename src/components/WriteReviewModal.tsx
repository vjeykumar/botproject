import React, { useState } from 'react';
import { X, Star, Send, Camera, User } from 'lucide-react';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
    recommend: boolean;
  }) => void;
  productName?: string;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productName = "Glass Product"
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        productId: '1', // This would be dynamic based on selected product
        rating,
        title,
        comment,
        recommend
      });
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setRecommend(true);
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = [
    '', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Write a Review</h2>
              <p className="text-gray-600 mt-1">Share your experience with {productName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating Section */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Overall Rating *
            </label>
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <p className="text-sm text-gray-600">
                {ratingLabels[hoveredRating || rating]}
              </p>
            )}
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Review Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience in a few words"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              maxLength={100}
            />
            <p className="text-sm text-gray-500 mt-1">{title.length}/100 characters</p>
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this product. What did you like or dislike? How was the quality? Would you recommend it?"
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none"
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-1">{comment.length}/1000 characters</p>
          </div>

          {/* Recommendation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Would you recommend this product?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={recommend === true}
                  onChange={() => setRecommend(true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Yes, I recommend this product</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={recommend === false}
                  onChange={() => setRecommend(false)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">No, I don't recommend this product</span>
              </label>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Review Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Be honest and helpful to other customers</li>
              <li>• Focus on the product's features and your experience</li>
              <li>• Avoid inappropriate language or personal information</li>
              <li>• Reviews are public and will be visible to all customers</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || !title.trim() || !comment.trim() || isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};