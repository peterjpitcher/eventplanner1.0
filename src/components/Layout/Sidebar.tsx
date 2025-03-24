import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  TagIcon, 
  CalendarIcon, 
  BookmarkIcon,
  ChatBubbleLeftRightIcon as ChatAltIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Customers', href: '/customers', icon: UserIcon },
  { name: 'Event Categories', href: '/event-categories', icon: TagIcon },
  { name: 'Events', href: '/events', icon: CalendarIcon },
  { name: 'Bookings', href: '/bookings', icon: BookmarkIcon },
  { name: 'SMS Notifications', href: '/sms-notifications', icon: ChatAltIcon },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Add window resize listener to properly handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar style
  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: '240px',
    backgroundColor: '#4338CA', // Change to indigo color for better visibility
    color: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    zIndex: 50,
    transform: isOpen || !isMobile ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column'
  };

  const sidebarHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '4rem',
    padding: '0 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0',
    overflow: 'auto',
    flex: 1
  };

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    margin: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    fontWeight: 500,
    color: isActive ? '#4338CA' : 'white',
    backgroundColor: isActive ? 'white' : 'transparent',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s'
  });

  const iconStyle = (isActive: boolean): React.CSSProperties => ({
    marginRight: '0.75rem',
    flexShrink: 0,
    width: '1.25rem',
    height: '1.25rem',
    color: isActive ? '#4338CA' : 'white'
  });

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40
  };
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && isMobile && (
        <div 
          style={backdropStyle}
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div style={sidebarStyle}>
        {/* Sidebar header */}
        <div style={sidebarHeaderStyle}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>Event System</span>
          </div>
          {isMobile && (
            <button 
              style={{
                padding: '0.25rem',
                borderRadius: '0.375rem',
                color: 'white',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={toggleSidebar}
            >
              <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          )}
        </div>
        
        {/* Navigation */}
        <nav style={navStyle}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                style={navItemStyle(isActive)}
                onClick={() => {
                  if (isMobile) {
                    toggleSidebar();
                  }
                }}
              >
                <item.icon
                  style={iconStyle(isActive)}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;