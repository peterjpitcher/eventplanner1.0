# Form Submission Flow

This document outlines the standardized form submission flow implemented across the Event Management System application.

## Overview

The form submission flow has been standardized to provide a consistent user experience across the application. This includes:

1. Form validation
2. Error handling
3. Loading states
4. Post-submission navigation

## Standard Form Submission Pattern

All form components in the application (CustomerForm, EventForm, BookingForm, EventCategoryForm) follow this standard pattern:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Validate form data
  if (!validateForm()) {
    return;
  }
  
  // 2. Prepare data for submission
  const data = {
    // Transform form data as needed
  };
  
  try {
    // 3. Set loading state
    setLoading(true);
    setError(null);
    
    if (isEdit && id) {
      // 4a. Update existing record
      await serviceObject.updateMethod(id, data);
      // 5a. Navigate to details page for edited item
      navigate(`/entity-type/${id}`);
    } else {
      // 4b. Create new record
      await serviceObject.createMethod(data);
      // 5b. Navigate back to list page after creation
      navigate('/entity-type');
    }
  } catch (err) {
    // 6. Handle errors
    console.error('Error saving data:', err);
    setError('Failed to save. Please try again.');
  } finally {
    // 7. Reset loading state
    setLoading(false);
  }
};
```

## Navigation After Submission

As of version 1.1.1, the application follows these navigation patterns:

### For Create Operations

After successfully creating a new record, the user is redirected to the list page for that entity type:
- Creating a customer → Redirect to `/customers`
- Creating an event → Redirect to `/events`
- Creating a booking → Redirect to `/bookings`
- Creating an event category → Redirect to `/event-categories`

This pattern provides better user flow by showing the newly created item in the context of all items, and avoids potential issues with navigating to a details page that might not immediately have all data loaded.

### For Update Operations

After successfully updating an existing record, the user is redirected to the details page for that specific record:
- Updating a customer → Redirect to `/customers/:id`
- Updating an event → Redirect to `/events/:id`
- Updating a booking → Redirect to `/bookings/:id`
- Updating an event category → Redirect to `/event-categories/:id`

## Form Validation

Each form implements a `validateForm()` function that performs client-side validation:

```typescript
const validateForm = (): boolean => {
  if (!formData.required_field.trim()) {
    setError('This field is required');
    return false;
  }
  
  // Additional validation rules
  
  return true;
};
```

## Loading and Error States

Forms implement consistent loading and error states:

1. A `loading` state variable controls:
   - Disabling form inputs during submission
   - Showing loading indicators
   - Preventing multiple submissions

2. An `error` state variable:
   - Displays validation errors
   - Shows server-side error messages
   - Is cleared before new submissions

## UI Components

All forms use consistent UI components with inline styles:

- Error containers with red background and border
- Disabled button styles during loading
- Required field indicators
- Consistent input field styling

## Implementation Examples

For specific implementations, refer to:

- [CustomerForm.tsx](../../src/pages/Customers/CustomerForm.tsx)
- [EventForm.tsx](../../src/pages/Events/EventForm.tsx)
- [BookingForm.tsx](../../src/pages/Bookings/BookingForm.tsx)
- [EventCategoryForm.tsx](../../src/pages/EventCategories/EventCategoryForm.tsx) 