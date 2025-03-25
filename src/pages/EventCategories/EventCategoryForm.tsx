import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EventCategory } from '../../types/database.types';
import { eventCategoryService } from '../../services/eventCategoryService';

type EventCategoryFormProps = {
  initialData?: Partial<EventCategory>;
  isEdit?: boolean;
};

const EventCategoryForm: React.FC<EventCategoryFormProps> = ({ initialData = {}, isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    default_capacity: initialData.default_capacity?.toString() || '50',
    default_start_time: initialData.default_start_time || '09:00',
    notes: initialData.notes || '',
  });
  
  // Always fetch category data when editing to ensure we have the correct data
  useEffect(() => {
    if (isEdit && id) {
      const fetchCategoryData = async () => {
        try {
          setLoading(true);
          const categoryData = await eventCategoryService.getCategoryById(id);
          if (categoryData) {
            console.log('Fetched category data:', categoryData);
            setFormData({
              name: categoryData.name || '',
              default_capacity: categoryData.default_capacity?.toString() || '50',
              default_start_time: categoryData.default_start_time || '09:00',
              notes: categoryData.notes || '',
            });
          } else {
            setError('Category not found');
          }
        } catch (err) {
          console.error('Error fetching category data:', err);
          setError('Failed to load category data. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchCategoryData();
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return false;
    }
    
    const capacity = parseInt(formData.default_capacity);
    if (isNaN(capacity) || capacity <= 0) {
      setError('Default capacity must be a positive number');
      return false;
    }
    
    if (!formData.default_start_time) {
      setError('Default start time is required');
      return false;
    }
    
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(formData.default_start_time)) {
      setError('Default start time must be in the format HH:MM');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const categoryData = {
      ...formData,
      default_capacity: parseInt(formData.default_capacity),
    };
    
    console.log('Attempting to save category:', categoryData);
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEdit && id) {
        console.log('Updating existing category with ID:', id);
        // Update existing category using the service
        const updated = await eventCategoryService.updateCategory(id, categoryData);
        console.log('Category updated successfully:', updated);
        navigate('/event-categories');
      } else {
        console.log('Creating new category');
        // Create new category using the service
        const created = await eventCategoryService.createCategory(categoryData);
        console.log('Category created successfully:', created);
        navigate('/event-categories');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Failed to save category. Please try again.');
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
        {isEdit ? 'Edit Event Category' : 'Add New Event Category'}
      </h1>
      
      {error && (
        <div style={errorContainerStyle} role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading category data...</div>
      ) : (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label 
              style={labelStyle} 
              htmlFor="name"
            >
              Category Name *
            </label>
            <input
              style={inputStyle}
              id="name"
              name="name"
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div style={formGroupStyle}>
            <label 
              style={labelStyle} 
              htmlFor="default_capacity"
            >
              Default Capacity *
            </label>
            <input
              style={inputStyle}
              id="default_capacity"
              name="default_capacity"
              type="number"
              min="1"
              placeholder="Default Capacity"
              value={formData.default_capacity}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div style={formGroupStyle}>
            <label 
              style={labelStyle} 
              htmlFor="default_start_time"
            >
              Default Start Time *
            </label>
            <input
              style={inputStyle}
              id="default_start_time"
              name="default_start_time"
              type="time"
              placeholder="Default Start Time"
              value={formData.default_start_time}
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
              onClick={() => navigate('/event-categories')}
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
              {loading ? 'Saving...' : isEdit ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EventCategoryForm; 