import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { isMockMode } from '../../services/supabase';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#4f46e5',
    color: 'white',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  };
  
  const headerContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  };
  
  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };
  
  const toggleButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const logoStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 'bold'
  };
  
  const navStyle: React.CSSProperties = {
    display: isMobile ? 'none' : 'block'
  };
  
  const navListStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  };
  
  const navLinkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 500,
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    transition: 'background-color 0.2s ease'
  };
  
  const mockBannerStyle: React.CSSProperties = {
    backgroundColor: '#f97316', 
    color: 'white', 
    textAlign: 'center', 
    padding: '0.25rem', 
    fontSize: '0.75rem',
    fontWeight: 'bold',
    width: '100%'
  };

  return (
    <header style={headerStyle}>
      {isMockMode && (
        <div style={mockBannerStyle}>
          Running in mock mode - no connection to Supabase
        </div>
      )}
      <div style={headerContainerStyle}>
        <div style={logoContainerStyle}>
          {isMobile && (
            <button
              type="button"
              style={toggleButtonStyle}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4338ca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Bars3Icon style={{ width: '1.5rem', height: '1.5rem' }} aria-hidden="true" />
            </button>
          )}
          <Link to="/" style={logoStyle}>
            Event Management System
          </Link>
        </div>
        <nav style={navStyle}>
          <ul style={navListStyle}>
            <li>
              <Link 
                to="/" 
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/customers" 
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Customers
              </Link>
            </li>
            <li>
              <Link 
                to="/events" 
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Events
              </Link>
            </li>
            <li>
              <Link 
                to="/bookings" 
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Bookings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 