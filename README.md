# Quickbase GPT Integration Project

This project integrates Quickbase's API with GPT actions through a middleware approach, enabling robust interaction while handling various technical constraints.

## Project Structure

```
.
├── qbAPI/                      # Quickbase API specifications
│   ├── 1. MVP/                # Core API implementations
│   │   ├── apps/             # Apps API actions & docs
│   │   └── records/          # Records API actions & docs
│   ├── 2. Beta/              # Beta stage API specs
│   └── 3. Prod/              # Production API specs
├── middleware-server/          # API routing middleware
└── GPT/                       # GPT-specific documentation
```

## Architecture

### 1. GPT Actions Layer
- OpenAPI specifications for GPT actions
- Handles user interactions
- Makes requests to middleware server through localtunnel
- Uses API key authentication configured in GPT editor UI

### 2. Middleware Server
- Routes requests to Quickbase API
- Handles authentication headers
- Provides unified endpoint structure
- Manages request/response formatting
- Exposed to internet via localtunnel for GPT access
- See [middleware-server/README.md](middleware-server/README.md) for details

### Development Access
The middleware server uses multiple localtunnel instances with PM2 process management for reliable GPT access:
1. Start everything with PM2:
```bash
cd middleware-server
npm run pm2:start
```

This starts the middleware server and multiple persistent tunnels with:
- Dedicated URLs for each endpoint group:
  * https://qb-apps.loca.lt - For Apps API
  * https://qb-records.loca.lt - For Records API
  * https://qb-tables.loca.lt - For Tables API
  * https://qb-files.loca.lt - For Files API
  * https://qb-users.loca.lt - For Users API
- Auto-restart on crashes
- Process monitoring
- Automatic reconnection
- Keep-alive settings

2. Configure GPT:
   - Use the appropriate tunnel URL for each endpoint group in OpenAPI specs
   - Set up API key authentication in GPT editor UI
   - Configure x-api-key header to match middleware's API_KEY

Note: The tunnel now uses a consistent subdomain, so you won't need to update your GPT configuration after restarts.

Useful commands:
```bash
# View logs
npm run pm2:logs

# Restart processes
npm run pm2:restart

# Stop everything
npm run pm2:stop
```

### 3. Quickbase API
- Final destination for requests
- Requires specific headers and authentication
- Provides core functionality

## Implementation Plan

### Phase 1: Core Infrastructure (Completed)
- [x] Define OpenAPI specifications for MVP endpoints
- [x] Create middleware server structure
- [x] Implement basic routing and authentication
- [x] Implement Quickbase API authentication
- [x] Add comprehensive request/response logging
- [x] Implement all MVP API endpoints

### Phase 2: Enhanced Functionality (Current)
- [x] Add Tables API support with relationships
- [x] Add Files API support with binary handling
- [x] Add Users API support with access management
- [x] Add Fields API support
- [ ] Implement request validation
- [ ] Add response transformation
- [ ] Enhance error handling

### Phase 3: Production Readiness
- [ ] Add comprehensive logging
- [ ] Implement rate limiting
- [ ] Add monitoring
- [ ] Deploy to DigitalOcean
- [ ] Set up CI/CD pipeline

## Technical Challenges & Solutions

### 1. GPT Actions Limitations
**Challenge**: One action per unique URL, custom headers not supported
**Solution**: Middleware server with different endpoints for each action

### 2. Authentication Flow
**Challenge**: Multiple authentication requirements (GPT → Middleware → Quickbase)
**Solution**: 
- GPT to Middleware: API key authentication via validateApiKey middleware
- Middleware to Quickbase: QB-Realm-Hostname and QB-USER-TOKEN headers managed through axios client
- Environment-based configuration using dotenv for secure credential management

### 3. Request/Response Handling
**Challenge**: Size limits and timeout constraints
**Solution**: Middleware handles chunking and streaming where needed

## Development Setup

1. Configure Quickbase API:
   - Get QB-Realm-Hostname
   - Generate QB-USER-TOKEN

2. Set up middleware server:
   ```bash
   cd middleware-server
   npm install
   # Configure .env file
   npm run dev
   ```

3. Test GPT actions:
   - Use provided curl commands in middleware README
   - Verify end-to-end functionality

## Current Status

Currently implementing Phase 1, focusing on:
1. Implementing additional API endpoints
2. Enhancing error handling
3. Documenting API endpoints and usage patterns

Key implementations completed:
- Authentication middleware with API key validation
- Quickbase API client with proper headers
- Environment-based configuration
- Comprehensive logging system with:
  - Request/response logging
  - Performance monitoring
  - Error tracking
  - File-based and console logging

See [middleware-server/README.md](middleware-server/README.md) for detailed progress and next steps.
