import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventCategoryForm from './EventCategoryForm';
import { EventCategory } from '../../types/database.types';

const EventCategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        
        // Create mock data for development
        setTimeout(() => {
          if (id) {
            const mockCategory: EventCategory = {
              id: id,
              name: `Category ${id}`,
              default_capacity: 50 + (parseInt(id) * 10),
              default_start_time: parseInt(id) % 2 === 0 ? '09:00' : '14:00',
              notes: Math.random() > 0.5 ? `Notes for category ${id}` : '',
              created_at: new Date().toISOString()
            };
            
            setCategory(mockCategory);
            setLoading(false);
          }
        }, 500);
      } catch (err) {
        console.error('Error loading category:', err);
        setError('Failed to load category details. Please try again later.');
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  // Define styles
  const containerStyle: React.CSSProperties = {
    maxWidth: '42rem',
    margin: '0 auto',
    padding: '1rem'
  };
  
  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '2rem',
    color: '#4F46E5'
  };
  
  const errorStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: '4px',
    borderLeftColor: '#EF4444',
    color: '#B91C1C',
    padding: '1rem',
    marginBottom: '1rem'
  };

  if (loading) {
    return <div style={containerStyle}><div style={loadingStyle}>Loading category details...</div></div>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle} role="alert">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/event-categories')}
            style={{
              backgroundColor: '#6B7280',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              marginTop: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4B5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6B7280';
            }}
          >
            Go Back to Categories
          </button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle} role="alert">
          <p>Category not found</p>
          <button 
            onClick={() => navigate('/event-categories')}
            style={{
              backgroundColor: '#6B7280',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              marginTop: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4B5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6B7280';
            }}
          >
            Go Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return <EventCategoryForm initialData={category} isEdit={true} />;
};

export default EventCategoryEdit; 