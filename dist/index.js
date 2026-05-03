import "dotenv/config";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";
// ============================================================================
// MAIN ENTRY POINT
// ============================================================================
/**
 * Starts the MCP Server with stdio transport.
 * Listens for requests from MCP clients on stdin and sends responses to stdout.
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("github-pattern-mcp-server is running on stdio");
}
// Execute main and handle errors
main().catch((error) => {
    console.error("Fatal error starting MCP server:", error);
    process.exit(1);
});
