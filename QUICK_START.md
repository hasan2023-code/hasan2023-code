# Quick Start - Configure MCP Server in VS Code

## 🚀 5 Minute Setup

### Step 1️⃣: Build Your Server
```bash
cd d:\Agentic-AI-Test\gitHubMcpServer
npm run build
```

### Step 2️⃣: Open VS Code Settings JSON
Press: `Ctrl+Shift+P` then type: `Preferences: Open User Settings (JSON`

### Step 3️⃣: Copy This Configuration

```json
{
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

**Note:** Replace `ghp_your_token_here` with:
- Your actual GitHub token from: https://github.com/settings/tokens
- OR leave empty if you don't have one (fewer API calls allowed)

### Step 4️⃣: Save & Restart
- Save: `Ctrl+S`
- Close VS Code completely
- Reopen VS Code

### Step 5️⃣: Verify It Works
Look for the MCP icon in VS Code sidebar → You should see **✓ github-patterns**

---

## 💬 Now Use Claude!

Try in the Claude chat window:

```
Search for async/await error handling patterns in TypeScript
```

Claude will automatically use your MCP server to search GitHub!

---

## 🎯 What Your Tools Can Do

### Tool 1: Search GitHub Implementations
```
Claude: "Find OAuth token refresh middleware in Go"
→ Your server searches GitHub
→ Returns matching code files and URLs
```

### Tool 2: Suggest Code Patterns
```
Claude: "Analyze error handling patterns in Node.js"
→ Your server searches GitHub
→ Analyzes files for best practices
→ Shows frequency of patterns used
```

---

## 📍 File Locations

| What | Where |
|------|-------|
| MCP Server Code | `d:/Agentic-AI-Test/gitHubMcpServer/src/` |
| Compiled Version | `d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js` |
| VS Code Settings | Ctrl+Shift+P → "Preferences: Open User Settings (JSON)" |
| GitHub Tokens | https://github.com/settings/tokens |

---

## ⚠️ Common Issues & Fixes

### Issue: "Server won't connect" (❌ in MCP panel)

**Fix 1:** Check the path is correct
```json
// Make sure you have the right path:
"args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"]
```

**Fix 2:** Rebuild the server
```bash
npm run build
```

**Fix 3:** Check VS Code Output panel
- Press: Ctrl+Shift+U
- Select: "MCP" from dropdown
- Look for error messages

### Issue: GitHub API rate limited

**Fix:** Add GitHub token to env
```json
"env": {
  "GITHUB_TOKEN": "ghp_your_token_here"
}
```

Get token: https://github.com/settings/tokens
- Scope needed: `public_repo`

### Issue: "node: command not found"

**Fix:** Node.js not in PATH
```bash
# Verify Node.js installed:
node --version

# If not installed, download from:
# https://nodejs.org/ (get version 20+)
```

---

## 📚 Full Documentation

I've created detailed guides:

1. **MCP_VS_CODE_SETUP.md** - Complete setup guide with troubleshooting
2. **MCP_VISUAL_GUIDE.md** - Architecture diagrams and flows
3. **ARCHITECTURE.md** - Code structure explanation

---

## 🔧 What Happens Next

Once configured:

1. **VS Code reads** `settings.json` on startup
2. **VS Code spawns** a Node process running your MCP server
3. **Server starts** and listens on stdin/stdout
4. **Claude in VS Code** can now use your tools
5. **You chat** with Claude and say "search for X pattern"
6. **Claude calls** your MCP server via stdio
7. **Your server** searches GitHub and returns results
8. **Claude displays** results in chat

---

## ✅ Test It!

Once setup is done, type to Claude:

```
"Find all common error handling patterns across TypeScript projects"
```

Claude will:
- Recognize you need GitHub search
- Call your `suggest_code_patterns` tool
- Get results from your server
- Show you which patterns are most commonly used
- Provide actual code examples

---

## 🎓 Understanding the Flow

```
You: "Search for async patterns"
    ↓
Claude (in VS Code): "I should use search_github_implementations"
    ↓
Your MCP Server: Receives request via stdin
    ↓
Server calls: searchGithubCode() → GitHub API
    ↓
Server sends response: Results via stdout
    ↓
Claude: Displays results with explanations
```

---

## 📞 Need Help?

- Check the **Troubleshooting** section in `MCP_VS_CODE_SETUP.md`
- Review the **Visual Guide** in `MCP_VISUAL_GUIDE.md`
- Look at **Architecture** in `ARCHITECTURE.md`
- Verify paths are using forward slashes `/` not backslashes `\`
- Make sure `npm run build` completed without errors

---

## 🎉 You're Done!

Your GitHub Pattern MCP Server is now an agent in Claude within VS Code!

**Next Steps:**
- Use it to find code patterns
- Ask Claude about implementations across GitHub
- Combine searches with analysis for deeper insights
- Share your findings with the team
