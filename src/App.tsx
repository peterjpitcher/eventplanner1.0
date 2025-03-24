import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/Customers/CustomerList';
import CustomerDetails from './pages/Customers/CustomerDetails';
import CustomerNew from './pages/Customers/CustomerNew';
import CustomerEdit from './pages/Customers/CustomerEdit';
import EventCategoryList from './pages/EventCategories/EventCategoryList';
import EventCategoryNew from './pages/EventCategories/EventCategoryNew';
import EventCategoryEdit from './pages/EventCategories/EventCategoryEdit';
import EventList from './pages/Events/EventList';
import EventDetails from './pages/Events/EventDetails';
import EventNew from './pages/Events/EventNew';
import EventEdit from './pages/Events/EventEdit';
import BookingList from './pages/Bookings/BookingList';
import BookingDetails from './pages/Bookings/BookingDetails';
import BookingNew from './pages/Bookings/BookingNew';
import BookingEdit from './pages/Bookings/BookingEdit';
import SMSNotifications from './pages/SMS/SMSNotifications';
import DatabaseInitializer from './components/Debug/DatabaseInitializer';

// Import global styles
import './index.css';

function App() {
  // Add event listener for window resize
  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      // Force a re-render when window size changes by updating a CSS variable
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/new" element={<CustomerNew />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/customers/:id/edit" element={<CustomerEdit />} />
          <Route path="/event-categories" element={<EventCategoryList />} />
          <Route path="/event-categories/new" element={<EventCategoryNew />} />
          <Route path="/event-categories/:id/edit" element={<EventCategoryEdit />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/new" element={<EventNew />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/:id/edit" element={<EventEdit />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/bookings/new" element={<BookingNew />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
          <Route path="/bookings/:id/edit" element={<BookingEdit />} />
          <Route path="/sms-notifications" element={<SMSNotifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <DatabaseInitializer />
      </Layout>
    </Router>
  );
}

export default App;
