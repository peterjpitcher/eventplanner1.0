import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Customer } from '../../types/database.types';
import { customerService } from '../../services/customerService';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      // Sort customers alphabetically by name
      const sortedData = sortCustomers(data, sortOrder);
      setCustomers(sortedData);
      setError(null);
    } catch (error) {
      setError('Failed to load customers. Please try again later.');
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortCustomers = (customers: Customer[], order: 'asc' | 'desc'): Customer[] => {
    return [...customers].sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      
      if (order === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setCustomers(sortCustomers(customers, newOrder));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCustomers();
      return;
    }

    try {
      setLoading(true);
      const data = await customerService.searchCustomers(searchQuery);
      // Apply sorting to search results
      const sortedData = sortCustomers(data, sortOrder);
      setCustomers(sortedData);
      setError(null);
    } catch (error) {
      setError('Failed to search customers. Please try again later.');
      console.error('Error searching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Common styles
  const pageStyle: React.CSSProperties = {
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };
  
  const headerContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };
  
  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827'
  };
  
  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: '#4F46E5',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500
  };
  
  const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: '#E5E7EB',
    color: '#4B5563',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500
  };
  
  const searchContainerStyle: React.CSSProperties = {
    marginBottom: '1.5rem'
  };
  
  const searchRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem'
  };
  
  const inputStyle: React.CSSProperties = {
    border: '1px solid #D1D5DB',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    flexGrow: 1
  };
  
  const errorStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  };
  
  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '2.5rem 0',
    color: '#6B7280'
  };
  
  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '2.5rem 0',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.375rem',
    color: '#6B7280'
  };
  
  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    overflow: 'hidden'
  };
  
  const tableStyle: React.CSSProperties = {
    minWidth: '100%',
    borderCollapse: 'collapse'
  };
  
  const tableHeadStyle: React.CSSProperties = {
    backgroundColor: '#F9FAFB'
  };
  
  const tableHeaderCellStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };
  
  const tableBodyStyle: React.CSSProperties = {
    backgroundColor: 'white'
  };
  
  const tableRowStyle: React.CSSProperties = {
    borderBottom: '1px solid #E5E7EB'
  };
  
  const tableCellStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    whiteSpace: 'nowrap'
  };
  
  const nameCellStyle: React.CSSProperties = {
    fontWeight: 500,
    color: '#111827'
  };
  
  const mobileCellStyle: React.CSSProperties = {
    color: '#6B7280'
  };
  
  const actionCellStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    whiteSpace: 'nowrap',
    textAlign: 'right',
    fontSize: '0.875rem',
    fontWeight: 500
  };
  
  const actionLinkStyle: React.CSSProperties = {
    color: '#4F46E5',
    textDecoration: 'none',
    marginRight: '1rem'
  };

  // Add styles for the sort button and sort indicator
  const sortButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#6B7280',
    padding: 0,
    fontSize: '0.75rem',
    fontWeight: 500
  };

  const sortIconStyle: React.CSSProperties = {
    marginLeft: '0.25rem',
    fontSize: '0.75rem'
  };

  return (
    <div style={pageStyle}>
      <div style={headerContainerStyle}>
        <h1 style={headerStyle}>Customers</h1>
        <Link
          to="/customers/new"
          style={primaryButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4338CA';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4F46E5';
          }}
        >
          Add Customer
        </Link>
      </div>

      <div style={searchContainerStyle}>
        <div style={searchRowStyle}>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={inputStyle}
          />
          <button
            onClick={handleSearch}
            style={primaryButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
            }}
          >
            Search
          </button>
          <button
            onClick={() => {
              setSearchQuery('');
              loadCustomers();
            }}
            style={secondaryButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D1D5DB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E7EB';
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <div style={loadingStyle}>Loading customers...</div>
      ) : customers.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No customers found.</p>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead style={tableHeadStyle}>
              <tr>
                <th style={tableHeaderCellStyle}>
                  <button 
                    style={sortButtonStyle}
                    onClick={toggleSortOrder}
                    title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    Name
                    <span style={sortIconStyle}>
                      {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  </button>
                </th>
                <th style={tableHeaderCellStyle}>Mobile</th>
                <th style={tableHeaderCellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody style={tableBodyStyle}>
              {customers.map((customer) => (
                <tr key={customer.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>
                    <div style={nameCellStyle}>
                      {customer.first_name} {customer.last_name}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={mobileCellStyle}>{customer.mobile_number}</div>
                  </td>
                  <td style={actionCellStyle}>
                    <Link
                      to={`/customers/${customer.id}`}
                      style={actionLinkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4338CA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#4F46E5';
                      }}
                    >
                      View
                    </Link>
                    <Link
                      to={`/customers/${customer.id}/edit`}
                      style={actionLinkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4338CA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#4F46E5';
                      }}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerList; 