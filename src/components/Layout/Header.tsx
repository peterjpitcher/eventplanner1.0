import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { isMockMode, supabaseStatus } from '../../services/supabase';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
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
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem'
  };
  
  const debugButtonStyle: React.CSSProperties = {
    backgroundColor: '#ffffff33',
    border: 'none',
    color: 'white',
    fontSize: '0.7rem',
    padding: '0.1rem 0.3rem',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    marginLeft: '0.5rem'
  };
  
  const debugInfoStyle: React.CSSProperties = {
    backgroundColor: '#111827',
    color: 'white',
    padding: '1rem',
    fontSize: '0.75rem',
    position: 'fixed',
    top: '4rem',
    right: '1rem',
    zIndex: 50,
    borderRadius: '0.375rem',
    maxWidth: '90%',
    width: '25rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };
  
  // Check which environment variables are available
  const showEnvVarStatus = () => {
    alert(
      `Environment Variables Status:\n\n` +
      `REACT_APP_SUPABASE_URL: ${supabaseStatus.hasUrl ? 'Present' : 'Missing'}\n` +
      `REACT_APP_SUPABASE_ANON_KEY: ${supabaseStatus.hasKey ? 'Present' : 'Missing'}\n\n` +
      `Current Mode: ${isMockMode ? 'MOCK' : 'PRODUCTION'}\n\n` +
      `Note: If you've added these variables in Vercel, remember that you need to redeploy the application for them to take effect.`
    );
  };

  return (
    <header style={headerStyle}>
      {isMockMode && (
        <div style={mockBannerStyle}>
          <span>Running in mock mode - no connection to Supabase</span>
          <button 
            style={debugButtonStyle} 
            onClick={showEnvVarStatus}
            title="Check environment variables"
          >
            Check Env Vars
          </button>
          <button 
            style={debugButtonStyle} 
            onClick={toggleDebugInfo}
            title="Show debug information"
          >
            {showDebugInfo ? 'Hide Debug' : 'Debug'}
          </button>
        </div>
      )}
      
      {showDebugInfo && (
        <div style={debugInfoStyle}>
          <h4 style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>Debug Information</h4>
          <p style={{ margin: '0 0 0.5rem' }}>
            The application is running in mock mode because Supabase environment variables are missing.
          </p>
          <p style={{ margin: '0 0 0.5rem' }}>
            <strong>REACT_APP_SUPABASE_URL:</strong> {supabaseStatus.hasUrl ? 'Present' : 'Missing'}
            <br />
            <strong>REACT_APP_SUPABASE_ANON_KEY:</strong> {supabaseStatus.hasKey ? 'Present' : 'Missing'}
          </p>
          <p style={{ margin: '0 0 0.5rem' }}>
            <strong>Production URL:</strong> {window.location.origin}
          </p>
          <div style={{ margin: '0.5rem 0', padding: '0.5rem', backgroundColor: '#374151', borderRadius: '0.25rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>To fix this issue:</p>
            <ol style={{ margin: '0', paddingLeft: '1.5rem' }}>
              <li>Add the environment variables in your Vercel project settings</li>
              <li>Trigger a redeployment in Vercel after adding the variables</li>
              <li>If you've already done this, check for typos in variable names</li>
              <li>Ensure your Supabase project is active and the API keys are valid</li>
            </ol>
          </div>
          <button 
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              cursor: 'pointer'
            }}
            onClick={() => setShowDebugInfo(false)}
          >
            Close
          </button>
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