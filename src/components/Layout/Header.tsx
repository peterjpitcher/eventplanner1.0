import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Add resize listener to handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#4f46e5', // indigo-600
    color: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    padding: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 30,
    width: '100%'
  };

  const headerContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1280px',
    margin: '0 auto',
    paddingLeft: isMobile ? '0' : '240px', // Account for sidebar on desktop
    transition: 'padding-left 0.3s ease'
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center'
  };

  const toggleButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    marginRight: '0.75rem',
    padding: '0.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'white',
    textDecoration: 'none'
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

  return (
    <header style={headerStyle}>
      <div style={headerContainerStyle}>
        <div style={logoContainerStyle}>
          {isMobile && (
            <button
              type="button"
              style={toggleButtonStyle}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
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
              <Link to="/" style={navLinkStyle}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/customers" style={navLinkStyle}>
                Customers
              </Link>
            </li>
            <li>
              <Link to="/events" style={navLinkStyle}>
                Events
              </Link>
            </li>
            <li>
              <Link to="/bookings" style={navLinkStyle}>
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