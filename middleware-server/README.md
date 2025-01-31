# Quickbase API Middleware

This middleware server acts as a proxy between GPT actions and the Quickbase API, solving several key challenges:

1. GPT Actions Limitations:
   - One action per unique URL
   - Custom headers not supported
   - Request/response size limits
   - 45 second timeout

2. Quickbase API Requirements:
   - Requires QB-Realm-Hostname header
   - Requires QB-USER-TOKEN authorization
   - Requires proper User-Agent

## Implementation Progress

### Completed
- Express server setup with:
  - API key authentication middleware (validateApiKey)
  - CORS and JSON body parsing
  - Structured error handling
  - Axios-based Quickbase client
  - Comprehensive logging system
- Environment configuration using dotenv:
  - Server port
  - API key validation
  - QB realm hostname
  - QB user token
- Core API endpoints implemented:
  - Apps API (GET, POST, GET/:id, DELETE)
  - Records API (query, create, delete)
  - Tables API with relationships
  - Files API with binary support
  - Users API with access management
- Authentication system:
  - Middleware API key validation
  - Quickbase header management
  - Error handling for auth failures
- Logging infrastructure:
  - Request/response logging
  - Performance monitoring
  - Error tracking
  - File-based and console logging
  - Special handling for binary data

### Current Focus
1. Enhancing error handling:
   - Custom error messages
   - Error recovery strategies
   - Error notification system
2. Implementing advanced features:
   - Response transformation
   - Request rate limiting
   - Caching strategy

### Next Steps
1. Add monitoring and alerting:
   - Health checks
   - Performance metrics
   - Alert notifications
2. Production readiness:
   - Load testing
   - Security auditing
   - Documentation updates

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in .env:
```
PORT=3000
API_KEY=your-secure-api-key
QB_REALM_HOSTNAME=your-domain.quickbase.com
QB_USER_TOKEN=your-user-token
```

3. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Apps
- GET /apps - List applications
- POST /apps - Create application
- GET /apps/:appId - Get application details
- POST /apps/:appId - Update application
- DELETE /apps/:appId - Delete application
- GET /apps/:appId/events - Get application events
- POST /apps/:appId/copy - Copy application

### Records
- POST /records/query - Query records
- POST /records - Insert/update records
- DELETE /records - Delete records

### Tables
- GET /tables - List tables in an app
- POST /tables - Create a table
- GET /tables/:tableId - Get table details
- POST /tables/:tableId - Update table
- DELETE /tables/:tableId - Delete table

### Table Relationships
- GET /tables/:tableId/relationships - Get relationships
- POST /tables/:tableId/relationship - Create relationship
- POST /tables/:tableId/relationship/:relationshipId - Update relationship
- DELETE /tables/:tableId/relationship/:relationshipId - Delete relationship

### Files
- GET /files/:tableId/:recordId/:fieldId/:versionNumber - Download file
- DELETE /files/:tableId/:recordId/:fieldId/:versionNumber - Delete file

### Users
- POST /users - Get users (with pagination)
- PUT /users/deny - Deny users access
- PUT /users/deny/:shouldDeleteFromGroups - Deny and remove users from groups
- PUT /users/undeny - Undeny users

## Authentication

### Middleware Authentication
The server uses a two-layer authentication system:

1. API Key Authentication:
   - Required x-api-key header for all requests
   - Validated by validateApiKey middleware
   - Must match API_KEY environment variable

2. Quickbase Authentication:
   - Managed internally by axios client
   - Sets required QB-Realm-Hostname header
   - Adds QB-USER-TOKEN authorization
   - Includes User-Agent identification

Example request:
```bash
curl -H "x-api-key: your-api-key" http://localhost:3000/apps
```

Note: The middleware handles all Quickbase authentication headers internally - clients only need to provide the x-api-key.

## Logging System

The middleware implements comprehensive logging with:

1. Request Logging:
   - HTTP method and URL
   - Headers (with sensitive data masked)
   - Query parameters
   - Request body (for non-GET requests)
   - Response status and timing
   - Special handling for file downloads

2. Performance Monitoring:
   - Request duration tracking
   - Quickbase API call timing
   - Response size monitoring
   - Binary data metrics

3. Error Tracking:
   - Detailed error messages
   - Stack traces
   - Request context
   - Error categorization

4. Log Storage:
   - Console output for development
   - File-based logging for production
   - Separate error log file
   - JSON formatted logs
   - Binary-safe logging

## Error Handling

The middleware provides detailed error responses including:
- Authentication errors (401)
- Quickbase API errors (with original error messages)
- Request validation errors
- Server errors (500)
- Binary data handling errors
