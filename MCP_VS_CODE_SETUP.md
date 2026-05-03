# How to Configure GitHub Pattern MCP Server in VS Code

This guide explains how to set up your GitHub Pattern MCP Server in VS Code so Claude can use it as an agent.

## Prerequisites

Before you start, ensure you have:
- VS Code installed
- Claude extension installed in VS Code
- Node.js 20+ installed
- Your MCP server built and ready (`npm run build`)
- GitHub token configured (optional but recommended)

---

## Step 1: Build Your MCP Server

First, make sure your server is built:

```bash
cd d:\Agentic-AI-Test\gitHubMcpServer
npm install
npm run build
```

This creates the `dist/index.js` file that will be executed by VS Code.

---

## Step 2: Get Your Absolute Path

You need the absolute path to your server's main file:

```bash
# Print the absolute path
cd d:\Agentic-AI-Test\gitHubMcpServer
echo %cd%\dist\index.js
```

**Example output:**
```
d:\Agentic-AI-Test\gitHubMcpServer\dist\index.js
```

Copy this path - you'll need it in the next step.

---

## Step 3: Configure VS Code Settings

There are two ways to configure the MCP server in VS Code:

### Option A: Using VS Code Settings UI (Recommended)

1. **Open VS Code Settings**
   - Press `Ctrl + ,` (Windows) or `Cmd + ,` (Mac)
   - Or go to: File → Preferences → Settings

2. **Search for "MCP"**
   - In the search box, type: `mcp`
   - Look for "MCP Servers" setting

3. **Click "Edit in settings.json"**
   - This opens the raw JSON settings file
   - Look for or create the `mcpServers` section

### Option B: Edit settings.json Directly

1. **Open settings.json**
   - Press `Ctrl + Shift + P` (Windows) or `Cmd + Shift + P` (Mac)
   - Type: "Preferences: Open User Settings (JSON)"
   - Press Enter

2. **Add your server configuration** (see Step 4)

---

## Step 4: Add Server Configuration

Add this configuration to your `settings.json`:

```json
{
  "mcpServers": {
    "github-patterns": {
      "command": "node",
      "args": ["d:\\Agentic-AI-Test\\gitHubMcpServer\\dist\\index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_github_token_here"
      }
    }
  }
}
```

### Configuration Breakdown

| Field | Meaning |
|-------|---------|
| `"github-patterns"` | Unique identifier for your server |
| `"command": "node"` | Use Node.js to run the server |
| `"args"` | Absolute path to your compiled server (use `\\` for Windows) |
| `"env"` | Environment variables passed to the server |
| `"GITHUB_TOKEN"` | Your GitHub personal access token (optional) |

### Important Notes

**For Windows paths:** Use double backslashes `\\` or forward slashes `/`
```json
// ✅ Correct (Windows)
"args": ["d:\\Agentic-AI-Test\\gitHubMcpServer\\dist\\index.js"]

// ✅ Also correct (Windows with forward slashes)
"args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"]

// ❌ Wrong (Windows single backslash)
"args": ["d:\Agentic-AI-Test\gitHubMcpServer\dist\index.js"]
```

---

## Step 5: Configure GitHub Token (Optional but Recommended)

### Get Your GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `MCP-Server-Token`
4. Select scopes:
   - `public_repo` - Access public repositories
   - `read:user` - Read user profile data
5. Click "Generate token"
6. Copy the token (you won't see it again!)

### Add Token to Your Configuration

Replace `ghp_your_github_token_here` with your actual token:

```json
{
  "mcpServers": {
    "github-patterns": {
      "command": "node",
      "args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxx_your_actual_token_xxxxx"
      }
    }
  }
}
```

---

## Step 6: Restart VS Code

After adding the configuration:

1. **Save** your `settings.json` file (Ctrl + S)
2. **Close** VS Code completely
3. **Reopen** VS Code

VS Code will automatically start your MCP server on startup.

---

## Step 7: Verify It's Working

### Check the MCP Panel

1. Look for the "MCP" icon in VS Code's sidebar (usually bottom left)
2. Click it to open the MCP panel
3. You should see your server listed:
   ```
   ✓ github-patterns
   ```

If you see a ✓ (checkmark), your server is running!

### If It Shows an Error (❌)

Check the debug panel:
1. Press `Ctrl + Shift + U` to open Output panel
2. Select "MCP" from the dropdown
3. Look for error messages
4. Common issues:
   - Wrong path to `dist/index.js`
   - Node.js not in PATH
   - Server build failed

---

## Step 8: Use It in Claude

Now you can use the MCP server with Claude in VS Code!

### Ask Claude to Use Your Server

In the Claude chat:

```
Search for async/await error handling patterns in TypeScript
```

Claude will:
1. Recognize you want to search GitHub
2. Call your MCP server's `search_github_implementations` tool
3. Get results back from GitHub
4. Present them to you

---

## Complete Example Configuration

Here's a complete `settings.json` with the GitHub Pattern server:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  "mcpServers": {
    "github-patterns": {
      "command": "node",
      "args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

---

## Troubleshooting

### Problem: Server won't start

**Solution:**
```bash
# Check if build succeeds
npm run build

# Check if Node.js is accessible
node --version

# Try running the server manually
node d:\Agentic-AI-Test\gitHubMcpServer\dist\index.js
```

### Problem: Path errors in settings.json

**Solution:** Use forward slashes (`/`) instead of backslashes:
```json
"args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"]
```

### Problem: GITHUB_TOKEN not working

**Solution:** Check token permissions:
1. Go to GitHub Settings → Personal access tokens
2. Verify token has `public_repo` scope
3. Ensure token isn't expired
4. Generate a new one if needed

### Problem: MCP panel shows error

**Solution:**
1. Open Output panel (Ctrl + Shift + U)
2. Select "MCP" from dropdown
3. Read error message
4. Check paths and environment variables
5. Rebuild with `npm run build`

---

## What Happens When You Use It

1. **You ask Claude:** "Find authentication patterns in Go"
2. **Claude:** Calls the `search_github_implementations` tool
3. **Your MCP Server:** Receives request via stdin
4. **Server:** Searches GitHub API
5. **Server:** Sends results via stdout
6. **Claude:** Displays results and can ask follow-up questions

---

## Advanced: Running Multiple MCP Servers

You can configure multiple MCP servers in VS Code:

```json
{
  "mcpServers": {
    "github-patterns": {
      "command": "node",
      "args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxx"
      }
    },
    "other-server": {
      "command": "node",
      "args": ["path/to/other/server/index.js"]
    }
  }
}
```

Claude can then use any of these tools!

---

## Testing Your Setup

Once configured, test with these prompts:

```
1. "Search for error handling patterns in TypeScript"
   → Uses: search_github_implementations

2. "Analyze async/await pattern usage in Node.js projects"
   → Uses: suggest_code_patterns

3. "Find common caching strategies in Go"
   → Uses: search_github_implementations + suggest_code_patterns
```
