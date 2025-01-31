# Chatcraft Functions

This folder contains Chatcraft function modules that extend the LLM's capabilities through external API integrations. Each function follows a standardized format with TypeScript types, comprehensive documentation, and test coverage.

## Contents

### quickbase.ts
A function module for interacting with Quickbase's Apps API. This module provides a complete CRUD interface for managing Quickbase applications.

#### Features
- Create new Quickbase applications with customizable settings
- Retrieve detailed application information
- Update application properties, variables, and security settings
- Delete applications with proper validation

#### Authentication
Requires:
- Quickbase User Token (`QB-USER-TOKEN`)
- Realm hostname (e.g., 'your-domain.quickbase.com')

#### Examples

Creating a new app:
```typescript
const newApp = await quickbaseApp({
  realmHostname: 'your-domain.quickbase.com',
  authToken: 'your_token',
  operation: 'create',
  name: 'My New App',
  description: 'App description',
  assignToken: true,
  securityProperties: {
    hideFromPublic: true,
    allowExport: false
  }
});
```

Getting app details:
```typescript
const app = await quickbaseApp({
  realmHostname: 'your-domain.quickbase.com',
  authToken: 'your_token',
  operation: 'get',
  appId: 'bqwriv8bw'
});
```

Updating an app:
```typescript
const updatedApp = await quickbaseApp({
  realmHostname: 'your-domain.quickbase.com',
  authToken: 'your_token',
  operation: 'update',
  appId: 'bqwriv8bw',
  name: 'Updated App Name',
  variables: [
    { name: 'ProjectEndDate', value: '2025-12-31' }
  ]
});
```

#### Error Handling
The function includes comprehensive error handling for:
- Missing required parameters
- Invalid API responses
- Network failures
- Authentication errors

#### Testing
Full test coverage is provided in `quickbase.test.ts`, covering:
- Successful CRUD operations
- Error cases
- Parameter validation
- API response handling

For detailed parameter descriptions and more examples, see the JSDoc comments in the source code.
