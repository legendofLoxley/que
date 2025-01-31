# Betty Memory System Integration

Technical reference for integrating with Betty's memory system. The system provides a specialized knowledge graph implementation in ArcadeDB with temporal organization and rich type relationships.

## Core Components

### 1. Type System
- Vertices: Primary entities (Person, Events, Projects, Areas)
- Edges: Relationships with metadata
- Documents: Resource storage
- Abstract base types with common properties

See memory_instructions.md for complete type system documentation.

### 2. API Integration
- OpenAPI specification in direct_query.yaml
- Authentication via X-API-Key header
- Rate limits and timeouts enforced
- Single command per request

## Available Tools

### 1. Schema Management
```json
POST /api/v1/command/schema/query
{
  "query": "SELECT FROM Type"
}
```

### 2. Data Operations

#### Create Vertex
```json
POST /api/v1/command/data
{
  "operation": "vertex",
  "action": "create",
  "class": "Person",
  "properties": {
    "name": "John",
    "attributes": {
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  }
}
```

#### Update Embedded Attribute
```json
POST /api/v1/command/data
{
  "operation": "vertex",
  "action": "update",
  "class": "#12:0",
  "path_properties": [
    {
      "path": "attributes.email",
      "value": "new@email.com"
    }
  ]
}
```

#### Multiple Path Updates
```json
POST /api/v1/command/data
{
  "operation": "vertex",
  "action": "update",
  "class": "#12:0",
  "path_properties": [
    {
      "path": "attributes.email",
      "value": "new@email.com"
    },
    {
      "path": "attributes.phone",
      "value": "+9876543210"
    }
  ]
}
```

### 3. Schema Operations
```json
POST /api/v1/command/schema
{
  "operation": "CREATE CLASS",
  "target": "Person",
  "type": "vertex",
  "properties": [
    {
      "name": "name",
      "type": "STRING",
      "constraints": ["MANDATORY", "NOT NULL"]
    }
  ]
}
```

## Technical Constraints

- Request timeout: 45 seconds
- Rate limiting enforced
- Single command per request
- Schema validation required
- Edge constraints enforced
- Temporal bucket placement automatic
- Index maintenance automatic

## Implementation Files

- memory_instructions.md: Type system and schema reference
- direct_query.yaml: OpenAPI specification
- best_practices.md: Implementation guidelines

## Response Format

Success:
```json
{
  "result": [
    {
      "rid": "#123:456",
      "class": "Person",
      "properties": {
        "name": "John",
        "attributes": {
          "email": "john@example.com"
        }
      }
    }
  ]
}
```

Error:
```json
{
  "error": "Error type",
  "detail": "Error description"
}
