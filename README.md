# GitHub Pattern MCP Server

An MCP (Model Context Protocol) server that:
- searches GitHub repositories for existing code implementations
- suggests reusable code patterns from sampled implementations

## Tools

1. `search_github_implementations`
- Searches GitHub code and returns relevant implementation files.
- Inputs: `problem` (required), `language` (optional), `perPage` (optional).

2. `suggest_code_patterns`
- Samples search results and extracts common implementation patterns.
- Inputs: `problem` (required), `language` (optional), `perPage` (optional).

## Requirements

- Node.js 20+
- GitHub token recommended for higher API rate limits (`GITHUB_TOKEN`)

## Setup

```bash
npm install
npm run build
```

## Run

```bash
npm start
```

For local development:

```bash
npm run dev
```

## Environment Variables

Use `.env.example` as a template.

- `GITHUB_TOKEN`: GitHub personal access token (recommended)
- `GITHUB_PAT`: optional fallback variable name (if you use this naming convention)

Create `.env` in the project root, for example:

```env
GITHUB_TOKEN=ghp_your_token_here
```

## Example MCP Client Configuration

```json
{
  "mcpServers": {
    "github-patterns": {
      "command": "node",
      "args": ["D:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

## Notes

- Without `GITHUB_TOKEN`, GitHub API limits are lower and may affect reliability.
- Pattern suggestions are heuristic and intended as implementation guidance, not static analysis guarantees.
