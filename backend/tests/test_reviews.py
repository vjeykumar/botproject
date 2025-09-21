import pytest
import json

class TestReviews:
    """Test cases for review endpoints"""
    
    def test_create_review_success(self, client, mock_db, auth_headers, sample_review):
        """Test creating a new review successfully"""
        response = client.post('/api/reviews', json=sample_review, headers=auth_headers)
        
        assert response.status_code == 201
        response_data = response.get_json()
        assert 'message' in response_data
        assert 'review' in response_data
        assert response_data['review']['rating'] == sample_review['rating']
        assert response_data['review']['product_id'] == sample_review['product_id']
    
    def test_create_review_missing_fields(self, client, mock_db, auth_headers):
        """Test creating a review with missing required fields"""
        incomplete_review = {
            'product_id': '507f1f77bcf86cd799439012'
            # Missing rating
        }
        
        response = client.post('/api/reviews', json=incomplete_review, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Missing required fields' in response_data['error']
    
    def test_create_review_invalid_rating(self, client, mock_db, auth_headers):
        """Test creating a review with invalid rating"""
        invalid_review = {
            'product_id': '507f1f77bcf86cd799439012',
            'rating': 6,  # Invalid rating (should be 1-5)
            'comment': 'Test comment'
        }
        
        response = client.post('/api/reviews', json=invalid_review, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Rating must be between 1 and 5' in response_data['error']
    
    def test_create_review_zero_rating(self, client, mock_db, auth_headers):
        """Test creating a review with zero rating"""
        invalid_review = {
            'product_id': '507f1f77bcf86cd799439012',
            'rating': 0,  # Invalid rating
            'comment': 'Test comment'
        }
        
        response = client.post('/api/reviews', json=invalid_review, headers=auth_headers)
        
        assert response.status_code == 400
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Rating must be between 1 and 5' in response_data['error']
    
    def test_create_review_unauthorized(self, client, mock_db, sample_review):
        """Test creating a review without authentication"""
        response = client.post('/api/reviews', json=sample_review)
        
        assert response.status_code == 401
    
    def test_get_reviews_by_product_success(self, client, mock_db):
        """Test getting reviews for a specific product"""
        product_id = '507f1f77bcf86cd799439012'
        mock_reviews = [
            {
                'id': '507f1f77bcf86cd799439015',
                'product_id': product_id,
                'rating': 5,
                'comment': 'Excellent product!',
                'user_name': 'John Doe',
                'created_at': '2025-01-01T00:00:00'
            }
        ]
        mock_stats = {
            'average_rating': 4.5,
            'total_reviews': 10,
            'rating_distribution': [0, 1, 2, 3, 4]
        }
        
        mock_db.reviews.find_reviews_by_product.return_value = mock_reviews
        mock_db.reviews.get_product_rating_stats.return_value = mock_stats
        
        response = client.get(f'/api/reviews/{product_id}')
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'reviews' in response_data
        assert 'stats' in response_data
        assert len(response_data['reviews']) == 1
        assert response_data['stats']['average_rating'] == 4.5
    
    def test_get_reviews_empty_product(self, client, mock_db):
        """Test getting reviews for a product with no reviews"""
        product_id = '507f1f77bcf86cd799439999'
        mock_db.reviews.find_reviews_by_product.return_value = []
        mock_db.reviews.get_product_rating_stats.return_value = {
            'average_rating': 0.0,
            'total_reviews': 0,
            'rating_distribution': [0, 0, 0, 0, 0]
        }
        
        response = client.get(f'/api/reviews/{product_id}')
        
        assert response.status_code == 200
        response_data = response.get_json()
        assert 'reviews' in response_data
        assert 'stats' in response_data
        assert len(response_data['reviews']) == 0
        assert response_data['stats']['total_reviews'] == 0
    
    def test_create_review_database_error(self, client, mock_db, auth_headers, sample_review):
        """Test handling database errors when creating reviews"""
        mock_db.reviews.create_review.side_effect = Exception("Database error")
        
        response = client.post('/api/reviews', json=sample_review, headers=auth_headers)
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to create review' in response_data['error']
    
    def test_get_reviews_database_error(self, client, mock_db):
        """Test handling database errors when getting reviews"""
        product_id = '507f1f77bcf86cd799439012'
        mock_db.reviews.find_reviews_by_product.side_effect = Exception("Database error")
        
        response = client.get(f'/api/reviews/{product_id}')
        
        assert response.status_code == 500
        response_data = response.get_json()
        assert 'error' in response_data
        assert 'Failed to get reviews' in response_data['error']
    
    def test_create_review_with_comment(self, client, mock_db, auth_headers):
        """Test creating a review with optional comment"""
        review_with_comment = {
            'product_id': '507f1f77bcf86cd799439012',
            'rating': 4,
            'comment': 'Good quality glass, fast delivery!'
        }
        
        response = client.post('/api/reviews', json=review_with_comment, headers=auth_headers)
        
        assert response.status_code == 201
        response_data = response.get_json()
        assert 'review' in response_data
        assert response_data['review']['comment'] == review_with_comment['comment']
    
    def test_create_review_without_comment(self, client, mock_db, auth_headers):
        """Test creating a review without optional comment"""
        review_without_comment = {
            'product_id': '507f1f77bcf86cd799439012',
            'rating': 5
        }
        
        response = client.post('/api/reviews', json=review_without_comment, headers=auth_headers)
        
        assert response.status_code == 201
        response_data = response.get_json()
        assert 'review' in response_data
        assert response_data['review']['rating'] == 5