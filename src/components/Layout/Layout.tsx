import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9fafb'
  };

  const contentContainerStyle: React.CSSProperties = {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  };

  const mainContentStyle: React.CSSProperties = {
    flex: '1 1 auto',
    overflow: 'auto',
    padding: '1.5rem',
    marginLeft: isMobile ? '0' : '240px', // Add sidebar width margin on desktop
    transition: 'margin-left 0.3s ease'
  };

  const footerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '1rem',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.875rem',
    marginLeft: isMobile ? '0' : '240px', // Match content margin
    transition: 'margin-left 0.3s ease'
  };

  return (
    <div style={layoutStyle}>
      <Header toggleSidebar={toggleSidebar} />
      <div style={contentContainerStyle}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main style={mainContentStyle}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
      <footer style={footerStyle}>
        <div>
          <p>© {new Date().getFullYear()} Event Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 