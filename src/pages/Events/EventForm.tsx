import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Event, EventCategory } from '../../types/database.types';
import { eventService } from '../../services/eventService';
import { eventCategoryService } from '../../services/eventCategoryService';

type EventFormProps = {
  initialData?: Partial<Event>;
  isEdit?: boolean;
};

const EventForm: React.FC<EventFormProps> = ({ initialData = {}, isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    category_id: initialData.category_id || '',
    capacity: initialData.capacity?.toString() || '',
    start_time: initialData.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '',
    notes: initialData.notes || '',
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Create mock data for development
        const mockCategories = Array(8).fill(null).map((_, i) => ({
          id: String(i + 1),
          name: `Category ${i + 1}`,
          default_capacity: 50 + (i * 10),
          default_start_time: i % 2 === 0 ? '09:00' : '14:00',
          created_at: new Date().toISOString()
        }));
        
        setCategories(mockCategories);
        
        // If this is a new event and categories are available, set the first category as default
        if (!isEdit && mockCategories.length > 0 && !formData.category_id) {
          handleCategoryChange(mockCategories[0].id);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load event categories. Please try again later.');
      }
    };
    
    loadCategories();
  }, [isEdit, formData.category_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = async (categoryId: string) => {
    try {
      if (!categoryId) return;
      
      setFormData((prev) => ({ ...prev, category_id: categoryId }));
      
      // Get default values from selected category
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        // Only set defaults for new events, not when editing
        if (!isEdit) {
          setFormData((prev) => ({
            ...prev,
            capacity: category.default_capacity.toString(),
            start_time: getDefaultStartTime(category.default_start_time)
          }));
        }
      }
    } catch (err) {
      console.error('Error setting category defaults:', err);
    }
  };

  // Calculate default start time based on the category's default time
  const getDefaultStartTime = (defaultTime: string): string => {
    // Get today's date
    const today = new Date();
    const [hours, minutes] = defaultTime.split(':').map(Number);
    
    today.setHours(hours, minutes, 0, 0);
    
    // If the time is already past for today, set it for tomorrow
    if (today < new Date()) {
      today.setDate(today.getDate() + 1);
    }
    
    return today.toISOString().slice(0, 16);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Event name is required');
      return false;
    }
    
    if (!formData.category_id) {
      setError('Event category is required');
      return false;
    }
    
    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity <= 0) {
      setError('Capacity must be a positive number');
      return false;
    }
    
    if (!formData.start_time) {
      setError('Start time is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const eventData = {
      ...formData,
      capacity: parseInt(formData.capacity),
    };
    
    try {
      setLoading(true);
      setError(null);
      
      // For development, mock the API calls
      setTimeout(() => {
        if (isEdit && id) {
          // Mock update
          console.log('Event updated:', { id, ...eventData });
          navigate(`/events/${id}`);
        } else {
          // Mock create
          const newId = Math.floor(Math.random() * 1000).toString();
          console.log('Event created:', { id: newId, ...eventData });
          navigate(`/events/${newId}`);
        }
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
      setLoading(false);
    }
  };

  // Define styles
  const containerStyle: React.CSSProperties = {
    maxWidth: '42rem',
    margin: '0 auto'
  };
  
  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#111827'
  };
  
  const errorContainerStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: '4px',
    borderLeftColor: '#EF4444',
    color: '#B91C1C',
    padding: '1rem',
    marginBottom: '1rem'
  };
  
  const formStyle: React.CSSProperties = {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderRadius: '0.375rem',
    padding: '2rem',
    marginBottom: '1rem'
  };
  
  const formGroupStyle: React.CSSProperties = {
    marginBottom: '1rem'
  };
  
  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  };
  
  const inputStyle: React.CSSProperties = {
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    appearance: 'none',
    borderWidth: '1px',
    borderRadius: '0.25rem',
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#1F2937'
  };
  
  const selectStyle: React.CSSProperties = {
    ...inputStyle
  };
  
  const warningTextStyle: React.CSSProperties = {
    color: '#EF4444',
    fontSize: '0.75rem',
    fontStyle: 'italic',
    marginTop: '0.25rem'
  };
  
  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1.5rem'
  };
  
  const cancelButtonStyle: React.CSSProperties = {
    backgroundColor: '#6B7280',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer'
  };
  
  const submitButtonStyle: React.CSSProperties = {
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer'
  };
  
  const disabledButtonStyle: React.CSSProperties = {
    opacity: 0.7,
    cursor: 'not-allowed'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        {isEdit ? 'Edit Event' : 'Add New Event'}
      </h1>
      
      {error && (
        <div style={errorContainerStyle} role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label 
            style={labelStyle} 
            htmlFor="name"
          >
            Event Name *
          </label>
          <input
            style={inputStyle}
            id="name"
            name="name"
            type="text"
            placeholder="Event Name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div style={formGroupStyle}>
          <label 
            style={labelStyle} 
            htmlFor="category_id"
          >
            Event Category *
          </label>
          <select
            style={selectStyle}
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p style={warningTextStyle}>
              No event categories available. Please create a category first.
            </p>
          )}
        </div>
        
        <div style={formGroupStyle}>
          <label 
            style={labelStyle} 
            htmlFor="capacity"
          >
            Capacity *
          </label>
          <input
            style={inputStyle}
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div style={formGroupStyle}>
          <label 
            style={labelStyle} 
            htmlFor="start_time"
          >
            Start Date & Time *
          </label>
          <input
            style={inputStyle}
            id="start_time"
            name="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div style={{...formGroupStyle, marginBottom: '1.5rem'}}>
          <label 
            style={labelStyle} 
            htmlFor="notes"
          >
            Notes
          </label>
          <textarea
            style={inputStyle}
            id="notes"
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={loading}
            rows={4}
          />
        </div>
        
        <div style={buttonContainerStyle}>
          <button
            style={{
              ...cancelButtonStyle,
              ...(loading ? disabledButtonStyle : {})
            }}
            type="button"
            onClick={() => navigate('/events')}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#4B5563';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#6B7280';
              }
            }}
          >
            Cancel
          </button>
          <button
            style={{
              ...submitButtonStyle,
              ...(loading ? disabledButtonStyle : {})
            }}
            type="submit"
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#4338CA';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#4F46E5';
              }
            }}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Add Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 