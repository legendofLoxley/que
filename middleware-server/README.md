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
- Authentication system:
  - Middleware API key validation
  - Quickbase header management
  - Error handling for auth failures
- Logging infrastructure:
  - Request/response logging
  - Performance monitoring
  - Error tracking
  - File-based and console logging

### Current Focus
1. Implementing additional endpoints:
   - Tables API integration
   - Fields API support
   - Files API implementation
2. Enhancing error handling:
   - Custom error messages
   - Error recovery strategies
   - Error notification system

### Next Steps
1. Implement advanced features:
   - Response transformation
   - Request rate limiting
   - Caching strategy
2. Add monitoring and alerting:
   - Health checks
   - Performance metrics
   - Alert notifications

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

2. Performance Monitoring:
   - Request duration tracking
   - Quickbase API call timing
   - Response size monitoring

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

## Error Handling

The middleware provides detailed error responses including:
- Authentication errors (401)
- Quickbase API errors (with original error messages)
- Request validation errors
- Server errors (500)
