import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventCategory } from '../../types/database.types';
import { eventCategoryService } from '../../services/eventCategoryService';

const EventCategoryList: React.FC = () => {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Use the service to get real data from Supabase
      const data = await eventCategoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load event categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      try {
        // Call the service to delete from Supabase
        await eventCategoryService.deleteCategory(id);
        // Update the local state
        setCategories(categories.filter(category => category.id !== id));
      } catch (err) {
        console.error('Error deleting category:', err);
        setError('Failed to delete category. Please try again.');
      }
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
  
  const emptyStateTextStyle: React.CSSProperties = {
    color: '#6B7280',
    marginTop: '0.5rem',
    fontSize: '0.875rem'
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
  
  const categoryNameStyle: React.CSSProperties = {
    fontWeight: 500,
    color: '#111827'
  };
  
  const detailTextStyle: React.CSSProperties = {
    color: '#6B7280'
  };
  
  const actionCellStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
    fontWeight: 500
  };
  
  const editLinkStyle: React.CSSProperties = {
    color: '#4F46E5',
    textDecoration: 'none',
    marginRight: '1rem'
  };
  
  const deleteButtonStyle: React.CSSProperties = {
    color: '#DC2626',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    padding: 0,
    fontSize: '0.875rem'
  };

  return (
    <div style={pageStyle}>
      <div style={headerContainerStyle}>
        <h1 style={headerStyle}>Event Categories</h1>
        <Link
          to="/event-categories/new"
          style={primaryButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4338CA';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4F46E5';
          }}
        >
          Add Category
        </Link>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <div style={loadingStyle}>Loading categories...</div>
      ) : categories.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={{ color: '#6B7280' }}>No event categories found.</p>
          <p style={emptyStateTextStyle}>Add a category to start creating events.</p>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead style={tableHeadStyle}>
              <tr>
                <th style={tableHeaderCellStyle}>
                  Name
                </th>
                <th style={tableHeaderCellStyle}>
                  Default Capacity
                </th>
                <th style={tableHeaderCellStyle}>
                  Default Start Time
                </th>
                <th style={tableHeaderCellStyle}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={tableBodyStyle}>
              {categories.map((category) => (
                <tr key={category.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>
                    <div style={categoryNameStyle}>{category.name}</div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={detailTextStyle}>{category.default_capacity}</div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={detailTextStyle}>{category.default_start_time}</div>
                  </td>
                  <td style={actionCellStyle}>
                    <Link
                      to={`/event-categories/${category.id}/edit`}
                      style={editLinkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4338CA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#4F46E5';
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      style={deleteButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#B91C1C';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#DC2626';
                      }}
                    >
                      Delete
                    </button>
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

export default EventCategoryList; 