import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SEARCH_ARGS_SCHEMA, SUGGEST_ARGS_SCHEMA } from "./schemas.js";
import { runSearchTool, runSuggestTool } from "./tools.js";

// ============================================================================
// MCP SERVER SETUP AND INITIALIZATION
// ============================================================================

/**
 * Initializes the MCP Server with available tools and request handlers.
 * Exposes two main tools:
 * 1. search_github_implementations - Search GitHub for code implementations
 * 2. suggest_code_patterns - Analyze and suggest code patterns from GitHub
 */
export const server = new Server(
  {
    name: "github-pattern-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

/**
 * Handler for ListToolsRequestSchema
 * Returns available tools that the MCP server exposes
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_github_implementations",
        description:
          "Search GitHub code for existing implementations of a feature/problem and return relevant files.",
        inputSchema: {
          type: "object",
          properties: {
            problem: {
              type: "string",
              description:
                "Feature or problem statement to search for (for example: oauth token refresh middleware).",
            },
            language: {
              type: "string",
              description: "Optional language filter (for example: TypeScript, Python, Go).",
            },
            perPage: {
              type: "integer",
              minimum: 1,
              maximum: 20,
              default: 6,
              description: "Number of code search results to return.",
            },
          },
          required: ["problem"],
        },
      },
      {
        name: "suggest_code_patterns",
        description:
          "Analyze GitHub implementations and suggest reusable code patterns with concrete examples.",
        inputSchema: {
          type: "object",
          properties: {
            problem: {
              type: "string",
              description: "Feature or problem statement to search for before pattern analysis.",
            },
            language: {
              type: "string",
              description: "Optional language filter (for example: TypeScript, Python, Go).",
            },
            perPage: {
              type: "integer",
              minimum: 3,
              maximum: 20,
              default: 10,
              description: "Number of search results sampled for pattern extraction.",
            },
          },
          required: ["problem"],
        },
      },
    ],
  };
});

/**
 * Handler for CallToolRequestSchema
 * Processes tool execution requests and routes to appropriate tool handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  const rawArgs = request.params.arguments ?? {};

  try {
    if (name === "search_github_implementations") {
      const args = SEARCH_ARGS_SCHEMA.parse(rawArgs);
      const result = await runSearchTool(args);

      return {
        content: [{ type: "text", text: result.text }],
        structuredContent: result.structured,
      };
    }

    if (name === "suggest_code_patterns") {
      const args = SUGGEST_ARGS_SCHEMA.parse(rawArgs);
      const result = await runSuggestTool(args);

      return {
        content: [{ type: "text", text: result.text }],
        structuredContent: result.structured,
      };
    }

    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      isError: true,
      content: [{ type: "text", text: `Tool execution failed: ${message}` }],
    };
  }
});
