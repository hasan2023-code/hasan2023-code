# MCP Server in VS Code - Visual Guide

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         VS Code IDE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────────┐    │
│  │  Claude Chat     │◄───────►│  MCP Client Plugin   │    │
│  │  (in VS Code)    │         │  (built-in)          │    │
│  └──────────────────┘         └──────────────────────┘    │
│                                          │                 │
│                                          │ stdin/stdout    │
│                                          ▼                 │
├─────────────────────────────────────────────────────────────┤
│  Process Spawned by VS Code                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Your MCP Server (GitHub Pattern Server)            │ │
│  │  📁 dist/index.js                                   │ │
│  │                                                     │ │
│  │  - Listens on stdin for tool requests              │ │
│  │  - Runs your tool handlers                         │ │
│  │  - Sends responses to stdout                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           │ HTTPS                           │
│                           ▼                                 │
├─────────────────────────────────────────────────────────────┤
│  Internet                                                   │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        GitHub REST API                              │ │
│  │  https://api.github.com/search/code                │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Configuration Flow

```
1. USER EDITS settings.json
        │
        ▼
2. ADD mcpServers configuration
        │
        ├─ "command": "node"
        ├─ "args": ["path/to/dist/index.js"]
        ├─ "env": {"GITHUB_TOKEN": "ghp_xxx"}
        │
        ▼
3. RESTART VS Code
        │
        ▼
4. VS Code reads settings.json
        │
        ▼
5. VS Code spawns Node.js process
        │
        ├─ Executes: node path/to/dist/index.js
        ├─ Sets env variables
        ├─ Connects stdin/stdout pipes
        │
        ▼
6. Your MCP Server starts
        │
        ├─ Initializes (types.ts, schemas.ts, etc.)
        ├─ Connects to stdio transport
        ├─ Waits for requests from Claude
        │
        ▼
7. Claude in VS Code can now use your tools!
```

## Request/Response Flow

```
STEP 1: User asks Claude
┌─────────────────────────────────────────┐
│ "Find async error handling in TypeScript" │
└─────────────────────────────────────────┘
                   │
                   ▼
   Claude recognizes tool opportunity
                   │
                   ▼
STEP 2: Claude calls your tool via MCP
┌──────────────────────────────────────────────────────────┐
│ TOOL CALL (JSON sent via stdin):                        │
├──────────────────────────────────────────────────────────┤
│ {                                                       │
│   "jsonrpc": "2.0",                                     │
│   "id": 1,                                              │
│   "method": "tools/call",                               │
│   "params": {                                           │
│     "name": "search_github_implementations",            │
│     "arguments": {                                      │
│       "problem": "async error handling",                │
│       "language": "TypeScript"                          │
│     }                                                   │
│   }                                                     │
│ }                                                       │
└──────────────────────────────────────────────────────────┘
                   │
                   ▼
STEP 3: Your MCP Server processes
┌──────────────────────────────────────────────────────────┐
│ 1. Receives JSON via stdin                              │
│ 2. Validates arguments (schemas.ts)                     │
│ 3. Calls searchGithubCode() (github-client.ts)         │
│ 4. Searches GitHub API                                 │
│ 5. Formats results (tools.ts)                          │
└──────────────────────────────────────────────────────────┘
                   │
                   ▼
STEP 4: Your server sends response
┌──────────────────────────────────────────────────────────┐
│ TOOL RESULT (JSON sent via stdout):                     │
├──────────────────────────────────────────────────────────┤
│ {                                                       │
│   "jsonrpc": "2.0",                                     │
│   "id": 1,                                              │
│   "result": {                                           │
│     "content": [{                                       │
│       "type": "text",                                   │
│       "text": "Found patterns...\n..."                  │
│     }],                                                 │
│     "structuredContent": {...}                         │
│   }                                                     │
│ }                                                       │
└──────────────────────────────────────────────────────────┘
                   │
                   ▼
STEP 5: Claude displays results
┌──────────────────────────────────────────┐
│ Here are error handling patterns found: │
│                                          │
│ • Structured Error Handling (80% files) │
│ • Input Validation (60% files)          │
│ • Async/Await patterns (100% files)    │
│                                          │
│ [Examples shown with links...]          │
└──────────────────────────────────────────┘
```

## Your Tools Available to Claude

Once configured, Claude can use these tools:

```
┌─────────────────────────────────────────────────────────┐
│         Available MCP Tools in VS Code                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. search_github_implementations                      │
│     ├─ Searches GitHub for code implementations       │
│     ├─ Inputs:                                         │
│     │  • problem (required): Feature to search for     │
│     │  • language (optional): TypeScript, Go, etc.     │
│     │  • perPage (optional): 1-20 results             │
│     └─ Returns: Files, URLs, code snippets            │
│                                                         │
│  2. suggest_code_patterns                             │
│     ├─ Analyzes code and suggests patterns             │
│     ├─ Inputs: (same as above)                        │
│     └─ Returns: Best practices with frequency          │
│        • Error Handling (80% found)                   │
│        • Input Validation (60% found)                 │
│        • ...etc                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Settings.json Location

```
Windows:
  %APPDATA%\Code\User\settings.json

macOS:
  ~/Library/Application Support/Code/User/settings.json

Linux:
  ~/.config/Code/user/settings.json

Quick way to open (all platforms):
  Press: Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (Mac)
  Type: "Preferences: Open User Settings (JSON)"
  Press Enter
```

## Quick Checklist

```
✓ Checklist to get MCP Server running in VS Code:

□ Step 1: Build the server
  npm run build

□ Step 2: Get GitHub token (optional but recommended)
  Go to: https://github.com/settings/tokens
  Create new token with "public_repo" scope

□ Step 3: Open VS Code Settings JSON
  Ctrl+Shift+P > "Preferences: Open User Settings (JSON)"

□ Step 4: Add mcpServers configuration
  See example below

□ Step 5: Save settings.json
  Ctrl+S

□ Step 6: Restart VS Code
  Close completely and reopen

□ Step 7: Check MCP panel
  Look for green checkmark next to "github-patterns"

□ Step 8: Test with Claude
  "Search for authentication patterns"
```

## Example Settings.json

**Minimal (without GitHub token):**
```json
{
  "mcpServers": {
    "github-patterns": {
      "command": "node",
      "args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"]
    }
  }
}
```

**Full (with GitHub token):**
```json
{
  "mcpServers": {
    "github-patterns": {
      "command": "node",
      "args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

## What Happens Behind the Scenes

```
VS Code Startup:
1. Reads settings.json
2. Sees "mcpServers" → "github-patterns"
3. Spawns process: node d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js
4. Sets up stdin/stdout pipes
5. Your index.ts runs → Creates server → Listens on stdio

Claude Chat:
1. User types message
2. Claude processes message
3. Claude checks available tools (your MCP server)
4. Decides which tool(s) to call
5. Sends request through stdio
6. Your server receives → Processes → Sends response
7. Claude reads response → Formats for user
```
