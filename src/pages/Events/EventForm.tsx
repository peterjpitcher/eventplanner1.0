import React, { useState, useEffect, useCallback } from 'react';
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

  const getDefaultStartTime = (defaultTime: string): string => {
    // Get today's date
    const today = new Date();
    // Get hours and minutes from default time string (format: "HH:MM")
    const [hours, minutes] = defaultTime.split(':').map(Number);
    
    // Set the time
    today.setHours(hours);
    today.setMinutes(minutes);
    
    // Return as ISO string format for datetime-local input
    return today.toISOString().slice(0, 16);
  };

  const handleCategoryChange = useCallback(async (categoryId: string) => {
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
      console.error('Error updating category defaults:', err);
    }
  }, [categories, isEdit]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Get real categories from Supabase
        const categoryData = await eventCategoryService.getAllCategories();
        setCategories(categoryData);
        
        // Only set a default category for new events if none is selected
        // and there are categories available
        if (!isEdit && categoryData.length > 0 && !formData.category_id) {
          // Don't automatically select the first category
          // Let the user choose from the "Select a category" option
          setFormData(prev => ({...prev, category_id: ''}));
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load event categories. Please try again later.');
      }
    };
    
    loadCategories();
  }, [isEdit, formData.category_id, handleCategoryChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Event name is required');
      return false;
    }
    if (!formData.category_id) {
      setError('Please select an event category');
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
      capacity: parseInt(formData.capacity)
    };
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEdit && id) {
        // Update existing event
        await eventService.updateEvent(id, eventData);
        navigate(`/events/${id}`);
      } else {
        // Create new event
        await eventService.createEvent(eventData);
        // Redirect back to the events list instead of details page
        navigate('/events');
      }
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
    } finally {
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