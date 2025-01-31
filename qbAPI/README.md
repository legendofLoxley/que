# Quickbase API Integration

This directory contains OpenAPI specifications and instructions for interacting with the Quickbase API through GPT actions.

## Structure

```
qbAPI/
├── 1. MVP/
│   ├── apps/
│   │   ├── quickbase_apps_actions.yaml    # OpenAPI spec for Apps API
│   │   └── quickbase_apps_instructions.md  # GPT instructions for Apps API
│   └── records/
│       └── quickbase_record_actions.yaml   # OpenAPI spec for Records API
```

## Authentication

The Quickbase API requires two headers for authentication:
1. `QB-Realm-Hostname`: Your Quickbase domain (e.g., demo.quickbase.com)
2. `Authorization`: Your Quickbase user token in QB-USER-TOKEN format

However, due to GPT Actions limitations:
- Only one security scheme is supported in the OpenAPI spec
- Custom header parameters are ignored
- OAuth is not compatible since Quickbase doesn't use standard OAuth2 flow

Current workaround options:
1. Use API Key authentication with Custom header in GPT UI
   - Set header name to match Quickbase's requirements
   - Provide token in QB-USER-TOKEN format
2. Handle QB-Realm-Hostname through middleware/proxy
   - Create proxy server that adds required headers
   - Point OpenAPI spec to proxy instead of direct Quickbase API

Note: These limitations are specific to GPT Actions and don't affect direct API usage.

## Available APIs

### Apps API (MVP)
Core operations for managing Quickbase applications:
- Create new applications
- Get application details
- Update application properties
- Delete applications
- Copy applications

### Records API (MVP)
Core operations for managing Quickbase records:
- Query records with filtering and sorting
- Insert/Update records (upsert)
- Delete records based on query

Each operation is documented in the OpenAPI specification with:
- Required parameters
- Request/response schemas
- Security requirements

## Usage

1. Ensure you have:
   - Valid Quickbase domain (QB-Realm-Hostname)
   - Valid user token (Authorization: QB-USER-TOKEN)
2. For Apps API:
   - Follow the instructions in quickbase_apps_instructions.md
   - Use the OpenAPI spec in quickbase_apps_actions.yaml
3. For Records API:
   - Use the OpenAPI spec in quickbase_record_actions.yaml

## Best Practices

- Always confirm destructive operations
- Keep app names unique within a realm
- Verify security settings during app creation
- Respect variable limits (max 10 per app)

## OpenAPI Specification Notes

The OpenAPI specification uses:
- Single security scheme for QB-Realm-Hostname
- Authorization token handled at runtime
- Standard request/response schemas
- Proper parameter definitions
