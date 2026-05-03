# Project Architecture

This document describes the modular structure of the GitHub Pattern MCP Server after refactoring.

## File Organization

The project is organized into the following modules, each with a specific responsibility:

### 1. **types.ts** - Type Definitions
Central location for all TypeScript type definitions used throughout the project.

**Exports:**
- `GitHubCodeSearchItem` - Single code search result from GitHub API
- `GitHubCodeSearchResponse` - Response envelope from GitHub code search API
- `GitHubContentResponse` - Response from GitHub content API
- `RetrievedFile` - A file with content fetched from GitHub
- `PatternDescriptor` - Pattern definition for code analysis
- `PatternSuggestion` - Pattern analysis result with examples
- `ToolResult` - Standard return type for MCP tool handlers

**When to modify:** Add new types needed across multiple modules

---

### 2. **schemas.ts** - Input Validation
Zod schemas for validating input parameters to MCP tools.

**Exports:**
- `SEARCH_ARGS_SCHEMA` - Validation schema for `search_github_implementations` tool
- `SUGGEST_ARGS_SCHEMA` - Validation schema for `suggest_code_patterns` tool
- `SearchArgs` - Inferred type for search tool arguments
- `SuggestArgs` - Inferred type for suggest tool arguments

**When to modify:** Change tool input parameters or validation rules

---

### 3. **patterns.ts** - Pattern Analysis Engine
Defines code patterns and provides analysis functions to extract patterns from code.

**Key Functions:**
- `sanitizeSnippet()` - Normalize and truncate code snippets
- `firstMatchingLine()` - Find code lines matching patterns
- `derivePatternSuggestions()` - Extract best practice patterns from files
- `extractFunctionSignatures()` - Parse function signatures (multi-language support)
- `deriveFallbackSuggestions()` - Generate suggestions when no patterns found

**Exports:**
- `PATTERN_DESCRIPTORS` - Predefined best practice patterns
- All analysis functions

**When to modify:** Change pattern detection logic or add new patterns

---

### 4. **github-client.ts** - GitHub API Interface
Handles all communication with GitHub REST API.

**Key Functions:**
- `searchGithubCode()` - Search GitHub code repositories
- `fetchTopFiles()` - Download file contents from search results
- `uniqueCount()` - Count unique repositories
- `hasGitHubToken()` - Check if auth token is configured
- `getGitHubApiBase()` - Get API base URL (for testing)

**Configuration:**
- `GITHUB_API_BASE` - GitHub API endpoint
- `USER_AGENT` - User agent for API requests
- `GITHUB_TOKEN` - Authentication token from environment

**When to modify:** Change GitHub API interactions, add rate limiting, update authentication

---

### 5. **tools.ts** - MCP Tool Handlers
Implements the actual MCP tools that handle requests from clients.

**TOOL: search_github_implementations**
- Function: `runSearchTool()`
- Searches GitHub for code implementations
- Returns file paths, URLs, and code snippets

**TOOL: suggest_code_patterns**
- Function: `runSuggestTool()`
- Analyzes implementations to identify best practices
- Returns pattern frequency and concrete examples

**When to modify:** Change tool behavior, add new tools, modify return formats

---

### 6. **server.ts** - MCP Server Setup
Initializes and configures the MCP Server instance.

**Exports:**
- `server` - Configured Server instance

**Handlers:**
- `ListToolsRequestSchema` - Returns available tools metadata
- `CallToolRequestSchema` - Routes tool execution requests

**When to modify:** Add new tools, change tool descriptions, modify error handling

---

### 7. **index.ts** - Main Entry Point
Minimal entry point that starts the server.

**Responsibilities:**
- Load environment variables
- Import and initialize server
- Connect to stdio transport
- Handle startup errors

**When to modify:** Change startup behavior, add initialization logic

---

## Data Flow

```
User Request (MCP Client)
         ↓
    index.ts (starts server)
         ↓
    server.ts (routes request)
         ↓
    tools.ts (handles business logic)
         ↓
  ┌─────────────┬──────────────┬──────────────┐
  ↓             ↓              ↓              ↓
github-client  patterns.ts   schemas.ts    types.ts
  (API calls)  (analysis)   (validation)  (types)
  ↓             ↓
GitHub API    Results
  ↓
Response back to User
```

## Dependency Graph

```
index.ts
  ↓
server.ts
  ├─ schemas.ts
  └─ tools.ts
      ├─ schemas.ts
      ├─ types.ts
      ├─ github-client.ts
      │   ├─ types.ts
      │   └─ uniqueCount(), searchGithubCode(), fetchTopFiles()
      └─ patterns.ts
          ├─ types.ts
          └─ Pattern analysis functions
```

## Adding New Features

### Add a new tool:
1. Define input schema in `schemas.ts`
2. Implement tool handler in `tools.ts`
3. Export handler from `tools.ts`
4. Add tool metadata in `server.ts` (ListToolsRequestSchema handler)
5. Add route in `server.ts` (CallToolRequestSchema handler)

### Add a new type:
1. Define type in `types.ts`
2. Export from `types.ts`
3. Import where needed

### Modify GitHub API behavior:
1. Update function in `github-client.ts`
2. Update error handling if needed
3. Test with both authenticated and unauthenticated requests

---

## Benefits of This Structure

✅ **Separation of Concerns** - Each module has a single responsibility
✅ **Testability** - Functions are pure and easily unit testable
✅ **Maintainability** - Easy to find and update functionality
✅ **Reusability** - Functions can be imported independently
✅ **Scalability** - Easy to add new tools or patterns
✅ **Clear Dependencies** - Explicit imports show relationships
