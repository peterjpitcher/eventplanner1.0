# Naming Standards Documentation
This directory contains documentation related to naming conventions and patterns for all aspects of the project.

## Contents
- [Documentation Naming](./documentation.md)
- [Code Naming](./code.md)
- [File Structure](./file-structure.md)
- [Database Naming](./database.md)
- [API Naming](./api.md)

## Purpose
This section defines naming conventions for all aspects of the project to ensure consistency and maintainability.

## Documentation Naming Standards

### 1. Directory Names
- Use lowercase with hyphens for spaces
- Use descriptive, purpose-indicating names
- Keep names concise but clear
- Examples:
  - `user-management/`
  - `authentication/`
  - `api-integration/`

### 2. File Names
- Use lowercase with hyphens for spaces
- Include file type in name
- Use descriptive, purpose-indicating names
- Examples:
  - `user-registration.md`
  - `api-endpoints.md`
  - `database-schema.md`

### 3. Section Headers
- Use Title Case for main sections
- Use Sentence case for subsections
- Keep headers concise and descriptive
- Examples:
  - `# User Management`
  - `# API Integration`
  - `## Authentication Flow`

### 4. Version Numbers
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Include version in enhancement documentation
- Examples:
  - `v1.0.0/`
  - `v2.1.0/`
  - `v1.0.1/`

### 5. Documentation IDs
- Use lowercase with hyphens
- Include document type prefix
- Examples:
  - `doc-api-authentication`
  - `doc-db-schema`
  - `doc-ui-components`

## Code Naming Standards

### 1. Variables
- Use camelCase for variables
- Use descriptive, purpose-indicating names
- Prefix boolean variables with 'is', 'has', 'should'
- Examples:
  ```javascript
  const userFirstName = 'John';
  const isActive = true;
  const hasPermission = false;
  ```

### 2. Functions
- Use camelCase for functions
- Use verbs or verb phrases
- Be descriptive of the function's purpose
- Examples:
  ```javascript
  function getUserById() {}
  function validateEmail() {}
  function handleSubmit() {}
  ```

### 3. Classes
- Use PascalCase for classes
- Use nouns or noun phrases
- Be descriptive of the class's purpose
- Examples:
  ```javascript
  class UserManager {}
  class AuthenticationService {}
  class DatabaseConnection {}
  ```

### 4. Constants
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names
- Group related constants
- Examples:
  ```javascript
  const MAX_RETRY_ATTEMPTS = 3;
  const API_BASE_URL = 'https://api.example.com';
  const DEFAULT_TIMEOUT = 5000;
  ```

### 5. Enums
- Use PascalCase for enum names
- Use UPPER_SNAKE_CASE for enum values
- Use descriptive names
- Examples:
  ```javascript
  enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    GUEST = 'GUEST'
  }
  ```

## File Structure Naming Standards

### 1. Component Files
- Use PascalCase for component files
- Match component name to file name
- Include component type in name
- Examples:
  - `UserProfile.tsx`
  - `LoginForm.tsx`
  - `NavigationBar.tsx`

### 2. Utility Files
- Use camelCase for utility files
- Use descriptive names
- Include purpose in name
- Examples:
  - `dateFormatter.ts`
  - `stringUtils.ts`
  - `validationHelper.ts`

### 3. Style Files
- Use camelCase for style files
- Match component name if component-specific
- Include 'styles' or 'css' in name
- Examples:
  - `userProfile.styles.ts`
  - `globalStyles.css`
  - `themeStyles.ts`

### 4. Test Files
- Use camelCase for test files
- Match component/function name
- Include 'test' or 'spec' in name
- Examples:
  - `userProfile.test.tsx`
  - `authService.spec.ts`
  - `utils.test.ts`

### 5. Configuration Files
- Use lowercase with hyphens
- Use descriptive names
- Include 'config' in name
- Examples:
  - `app-config.ts`
  - `database-config.ts`
  - `api-config.ts`

## Database Naming Standards

### 1. Tables
- Use lowercase with underscores
- Use plural form
- Be descriptive
- Examples:
  - `users`
  - `event_bookings`
  - `customer_notes`

### 2. Columns
- Use lowercase with underscores
- Use descriptive names
- Include data type in name if needed
- Examples:
  - `first_name`
  - `created_at`
  - `is_active`

### 3. Primary Keys
- Use 'id' as standard
- Use UUID format
- Examples:
  - `id UUID PRIMARY KEY`

### 4. Foreign Keys
- Use table name in singular + '_id'
- Match primary key format
- Examples:
  - `user_id`
  - `event_id`
  - `customer_id`

### 5. Indexes
- Use lowercase with underscores
- Include purpose in name
- Examples:
  - `idx_users_email`
  - `idx_events_date`
  - `idx_bookings_status`

## API Naming Standards

### 1. Endpoints
- Use lowercase with hyphens
- Use plural form for resources
- Be RESTful
- Examples:
  - `/api/users`
  - `/api/event-bookings`
  - `/api/customer-notes`

### 2. Query Parameters
- Use camelCase
- Be descriptive
- Use standard prefixes
- Examples:
  - `?sortBy=createdAt`
  - `?filterBy=status`
  - `?include=details`

### 3. Request/Response Bodies
- Use camelCase for properties
- Be descriptive
- Use consistent naming
- Examples:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
  ```

### 4. Error Codes
- Use standard HTTP status codes
- Use descriptive error messages
- Include error codes in responses
- Examples:
  ```json
  {
    "error": {
      "code": "USER_NOT_FOUND",
      "message": "User with ID 123 not found"
    }
  }
  ```

### 5. Version Numbers
- Include in URL path
- Use semantic versioning
- Examples:
  - `/api/v1/users`
  - `/api/v2/events`
  - `/api/v1.1/bookings` 