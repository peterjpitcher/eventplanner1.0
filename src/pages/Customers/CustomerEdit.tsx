import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import { Customer } from '../../types/database.types';

const CustomerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setLoading(true);
        
        // Create mock data for development
        setTimeout(() => {
          if (id) {
            const mockCustomer: Customer = {
              id: id,
              first_name: `First${id}`,
              last_name: `Last${id}`,
              email: `customer${id}@example.com`,
              mobile_number: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              notes: `Notes for customer ${id}`,
              created_at: new Date().toISOString()
            };
            
            setCustomer(mockCustomer);
            setLoading(false);
          }
        }, 500);
      } catch (err) {
        console.error('Error loading customer:', err);
        setError('Failed to load customer details. Please try again later.');
        setLoading(false);
      }
    };

    loadCustomer();
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
    return <div style={containerStyle}><div style={loadingStyle}>Loading customer details...</div></div>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle} role="alert">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/customers')}
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
            Go Back to Customers
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle} role="alert">
          <p>Customer not found</p>
          <button 
            onClick={() => navigate('/customers')}
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
            Go Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return <CustomerForm initialData={customer} isEdit={true} />;
};

export default CustomerEdit; 