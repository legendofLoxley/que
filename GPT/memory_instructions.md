# Memory System Instructions

**Context**: The Memory System is a specialized knowledge graph implementation that enables AI assistants to store and retrieve information using a rich type system. It provides a hierarchical structure of vertices and edges with temporal organization, allowing for complex relationship modeling and efficient querying.

**Instructions**:

1. When storing new information:
   - First, query the schema to understand the target type's structure:
     {
       "query": "SELECT FROM schema:types WHERE name = :typeName",
       "params": {
         "typeName": "Person"
       }
     }
   - Choose the most specific vertex type for the data (never use base types directly)
   - Set required base properties (name, created, updated)
   - Include all relevant type-specific properties based on schema definition
   - Use appropriate edge types to establish relationships

2. When querying information:
   - Use direct SQL queries for precise lookups
   - Leverage path-based property access for nested data
   - Consider temporal aspects using created/updated fields
   - Respect type hierarchies when traversing relationships

3. When updating existing data:
   - First, verify the type's schema and available properties:
     {
       "query": "SELECT FROM schema:types WHERE name = :typeName",
       "params": {
         "typeName": "Person"
       }
     }
   - Use path_properties for targeted updates to nested structures
   - Ensure property names and types match schema definition
   - Always update the 'updated' timestamp
   - Maintain relationship consistency when modifying edges
   - Use archived flag instead of deletion when appropriate

**Additional Notes**:
- All vertices inherit from BaseVertex with common properties
- All edges inherit from BaseEdge with relationship tracking
- Use appropriate subtypes for specialized behavior
- Consider type constraints when creating relationships

## Type System

### Base Types

#### BaseVertex
Common properties for all vertices:
name: STRING
created: DATETIME
updated: DATETIME
archived: BOOLEAN (default: false)

#### BaseEdge
Common properties for all edges:
created: DATETIME
updated: DATETIME
relationship: STRING
archived: BOOLEAN (default: false)

### Vertex Types

#### Person
Properties:
email: STRING
phone: STRING
birthdate: DATE

#### Project
Properties:
startDate: DATE
endDate: DATE
status: STRING

#### Opportunity
Properties:
category: STRING
startDate: DATE
endDate: DATE
status: STRING

#### Location
Properties:
address: STRING
coordinates: STRING
type: STRING

#### Activity Hierarchy
Base type for activity tracking (do not use directly)
- **UserActivity**
  type: STRING
  details: STRING
  dueDate: DATE
- **SystemActivity**
  eventType: STRING
  severity: STRING
  logMessage: STRING
- **AssignedActivity**
  assignee: STRING
  dueDate: DATE
  priority: STRING

#### Entity Hierarchy
Base type for organizational entities (do not use directly)
- **Business**
  industry: STRING
  size: STRING
  website: STRING
- **Team**
  department: STRING
  manager: STRING
  memberCount: INTEGER

#### Document Hierarchy
Base type for content storage (do not use directly)
- **Email**
  sender: STRING
  recipients: LIST OF STRING
  subject: STRING
- **Recipe**
  ingredients: LIST OF STRING
  steps: LIST OF STRING
  servingSize: INTEGER
- **Journal**
  type: STRING
  tags: LIST OF STRING

#### Event Hierarchy
Base type for temporal events (do not use directly)
- **Meeting**
  agenda: STRING
  participants: LIST OF STRING
  location: STRING
- **Milestone**
  targetDate: DATE
  progress: DOUBLE
- **GroupEvent**
  members: LIST OF STRING
  type: STRING
  purpose: STRING
  rules: STRING
- **SystemEvent**
  source: STRING
  code: STRING
  description: STRING
- **Incident**
  severity: STRING
  resolution: STRING
  resolved: BOOLEAN

#### Asset Hierarchy
Base type for trackable items (do not use directly)
- **Vehicle**
  make: STRING
  model: STRING
  year: INTEGER
- **Software**
  version: STRING
  licenseType: STRING
  repository: STRING

#### Concept Hierarchy
Base type for abstract concepts (do not use directly)
- **License**
  type: STRING
  expiration: DATE
  terms: STRING
- **Budget**
  amount: DOUBLE
  currency: STRING
  period: STRING
- **Goal**
  description: STRING
  deadline: DATE
  progress: DOUBLE

#### Resource Hierarchy
Base type for allocatable resources (do not use directly)
- **Role**
  permissions: LIST OF STRING
  hierarchyLevel: INTEGER
  description: STRING
- **Lumber**
  type: STRING
  qualityGrade: STRING
  quantity: INTEGER
- **Ingredient**
  unit: STRING
  expiration: DATE
  allergens: LIST OF STRING
  quantity: INTEGER

### Edge Types
All edge types inherit from BaseEdge:
- Used_On: Indicates usage relationships
- Part_Of: Represents component relationships
- Related_To: General association
- Created_By: Indicates creation relationships
- Assigned_To: Represents task assignments
- Located_At: Indicates physical location
- Owned_By: Represents ownership
- Contains: Indicates containment
- Depends_On: Represents dependencies
- Follows: Temporal or semantic sequence
- Precedes: Temporal or semantic sequence
- Interacts_With: Represents interactions
- Manages: Indicates management relationships
- Reports_To: Represents reporting structure
- Belongs_To: Indicates membership
- Version_Of: Represents version relationships
- References: Indicates reference relationships
- Implements: Represents implementation
- Requires: Indicates requirements

## API Usage

### Direct Query Operations

#### Execute SQL Query
{
  "language": "sql",
  "command": "SELECT FROM Person WHERE name = :name",
  "params": {
    "name": "John"
  },
  "limit": 10
}

#### Create Vertex with Nested Properties
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

#### Update Using Path Properties
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

### Schema Operations

#### Get Type Information
{
  "query": "SELECT FROM schema:types"
}

#### Create New Type
{
  "operation": "CREATE CLASS",
  "target": "CustomType",
  "type": "vertex",
  "properties": [
    {
      "name": "name",
      "type": "STRING",
      "constraints": ["MANDATORY", "NOT NULL"]
    }
  ]
}

## Technical Constraints

- Request timeout: 45 seconds
- Default result limit: 100 (max 1000)
- Rate limiting enforced
- Schema validation required
- Edge constraints enforced
- Automatic index maintenance
- Path notation pattern: ^[a-zA-Z_][a-zA-Z0-9_]*(.[a-zA-Z_][a-zA-Z0-9_]*)*$
