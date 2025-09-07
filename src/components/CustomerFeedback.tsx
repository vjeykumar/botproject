import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp, Filter, ChevronDown } from 'lucide-react';
import { WriteReviewModal } from './WriteReviewModal';
import { apiService } from '../services/api';

export const CustomerFeedback: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'rating'>('newest');
  const [showAll, setShowAll] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleWriteReview = async (reviewData: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
    recommend: boolean;
  }) => {
    try {
      await apiService.createReview({
        product_id: reviewData.productId,
        rating: reviewData.rating,
        comment: `${reviewData.title}\n\n${reviewData.comment}`,
      });
      
      // Refresh reviews after submission
      // In a real app, you'd fetch reviews for the specific product
      console.log('Review submitted successfully');
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  };

  const overallRating = 0.0;
  const totalReviews = 0;
  const ratingDistribution = [0, 0, 0, 0, 0];

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Customer Reviews</h2>
        
        {/* Rating Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center justify-center md:justify-start mb-2">
                <span className="text-4xl font-bold text-gray-900 mr-2">{overallRating.toFixed(1)}</span>
                {renderStars(overallRating, 'lg')}
              </div>
              <p className="text-gray-600">Based on {totalReviews} reviews</p>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-8">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${totalReviews > 0 ? (ratingDistribution[rating - 1] / totalReviews) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating - 1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share your experience with our glass products!</p>
            <button 
              onClick={() => setShowWriteReview(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write First Review
            </button>
          </div>
        )}

        {/* Write Review Modal */}
        <WriteReviewModal
          isOpen={showWriteReview}
          onClose={() => setShowWriteReview(false)}
          onSubmit={handleWriteReview}
          productName="Edgecraft Glass Products"
        />
      </div>
    </div>
  );
};