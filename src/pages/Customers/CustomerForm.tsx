import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Customer } from '../../types/database.types';
import { customerService } from '../../services/customerService';

type CustomerFormProps = {
  initialData?: Partial<Customer>;
  isEdit?: boolean;
};

const CustomerForm: React.FC<CustomerFormProps> = ({ initialData = {}, isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || '',
    last_name: initialData.last_name || '',
    mobile_number: initialData.mobile_number || '',
    notes: initialData.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.first_name.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.last_name.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.mobile_number.trim()) {
      setError('Mobile number is required');
      return false;
    }
    
    // UK phone number validation
    // Allow formats like: 07123456789, 07123 456 789, +447123456789
    const cleanedNumber = formData.mobile_number.replace(/\s/g, '');
    const ukMobileRegex = /^(07\d{9}|\+447\d{9})$/;
    
    if (!ukMobileRegex.test(cleanedNumber)) {
      setError('Please enter a valid UK mobile number (starting with 07)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEdit && id) {
        // Update existing customer
        await customerService.updateCustomer(id, formData);
        navigate(`/customers/${id}`);
      } else {
        // Create new customer
        const newCustomer = await customerService.createCustomer(formData);
        navigate('/customers');
      }
    } catch (err) {
      console.error('Error saving customer:', err);
      setError('Failed to save customer. Please try again.');
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
  
  const helperTextStyle: React.CSSProperties = {
    color: '#6B7280',
    fontSize: '0.75rem',
    fontStyle: 'italic'
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
        {isEdit ? 'Edit Customer' : 'Add New Customer'}
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
            htmlFor="first_name"
          >
            First Name *
          </label>
          <input
            style={inputStyle}
            id="first_name"
            name="first_name"
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div style={formGroupStyle}>
          <label 
            style={labelStyle} 
            htmlFor="last_name"
          >
            Last Name *
          </label>
          <input
            style={inputStyle}
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div style={formGroupStyle}>
          <label 
            style={labelStyle} 
            htmlFor="mobile_number"
          >
            Mobile Number *
          </label>
          <input
            style={inputStyle}
            id="mobile_number"
            name="mobile_number"
            type="tel"
            placeholder="Mobile Number"
            value={formData.mobile_number}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <p style={helperTextStyle}>Format: 07XXX XXX XXX (UK mobile number)</p>
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
            onClick={() => navigate('/customers')}
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
            {loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm; 