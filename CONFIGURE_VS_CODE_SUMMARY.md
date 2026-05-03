# 📋 GitHub Pattern MCP Server - Complete Configuration Guide

## Your Setup is Ready! 🎉

You now have a fully refactored, modular MCP server that can be used as an agent in VS Code. Here's everything you need to know.

---

## 📁 Project Structure

```
d:\Agentic-AI-Test\gitHubMcpServer
│
├── 📂 src/                           <- Source code (TypeScript)
│   ├── index.ts                      <- Entry point
│   ├── server.ts                     <- MCP server setup
│   ├── tools.ts                      <- Tool implementations
│   ├── github-client.ts              <- GitHub API wrapper
│   ├── patterns.ts                   <- Pattern analysis
│   ├── schemas.ts                    <- Input validation
│   └── types.ts                      <- Type definitions
│
├── 📂 dist/                          <- Compiled JavaScript (after npm run build)
│   └── index.js                      <- Main compiled file (used by VS Code)
│
├── 📄 package.json                   <- Dependencies & scripts
├── 📄 tsconfig.json                  <- TypeScript config
│
└── 📄 Documentation:
    ├── QUICK_START.md                <- ⭐ Start here!
    ├── MCP_VS_CODE_SETUP.md          <- Detailed setup guide
    ├── MCP_VISUAL_GUIDE.md           <- Diagrams & flows
    ├── ARCHITECTURE.md               <- Code organization
    └── README.md                     <- Project info
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Build
```bash
cd d:\Agentic-AI-Test\gitHubMcpServer
npm run build
```

### Step 2: Configure VS Code
Add to settings.json (Ctrl+Shift+P → "Preferences: Open User Settings (JSON)"):
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

### Step 3: Restart VS Code
Close and reopen VS Code.

✅ Done! Look for green checkmark in MCP panel.

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **QUICK_START.md** | Fast setup, common issues, test examples |
| **MCP_VS_CODE_SETUP.md** | Complete guide with all details |
| **MCP_VISUAL_GUIDE.md** | Diagrams showing how everything works |
| **ARCHITECTURE.md** | Code structure and design |

📖 **Recommended Reading Order:**
1. QUICK_START.md (you are here!)
2. MCP_VS_CODE_SETUP.md (if you need details)
3. MCP_VISUAL_GUIDE.md (to understand the flow)
4. ARCHITECTURE.md (for code organization)

---

## 💡 How It Works

```
                    VS Code IDE
                   (with Claude)
                         │
                         │ User: "Search for X pattern"
                         ▼
                    Claude Chat
                         │
                         │ "I should use the GitHub search tool"
                         ▼
         Your MCP Server (runs in Node.js process)
                         │
         ├─ Receives request via stdin
         ├─ Validates with schemas.ts
         ├─ Calls github-client.ts
         ├─ Searches GitHub API
         ├─ Analyzes with patterns.ts
         └─ Sends response via stdout
                         │
                         ▼
                    Claude Chat

                  "Here are the patterns found..."
```

---

## 🛠️ Your MCP Server Tools

Once configured, Claude can use these tools:

### 1. **search_github_implementations**
```
Input:
  - problem (required): "async error handling"
  - language (optional): "TypeScript"
  - perPage (optional): 1-20

Output:
  - List of matching GitHub repositories
  - File paths
  - Direct URLs
  - Code snippets
```

Example: `"Find OAuth implementations in Go"`

### 2. **suggest_code_patterns**
```
Input:
  - problem (required): "caching strategies"
  - language (optional): "Python"
  - perPage (optional): 3-20

Output:
  - Best practice patterns found
  - Frequency (% of projects using it)
  - Real-world examples
  - Links to implementations
```

Example: `"Analyze error handling patterns across projects"`

---

## 🔧 Configuration Details

### GitHub Token (Optional but Recommended)

**Why:** More API requests allowed
- Without token: 10 requests/minute
- With token: 60 requests/minute

**How to get:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Classic"
3. Name: "MCP-Server-Token"
4. Scopes: Check `public_repo`
5. Copy the token (shows only once!)
6. Add to settings.json

### VS Code Settings Path

Find settings.json at:
- **Windows:** `%APPDATA%\Code\User\settings.json`
- **Mac:** `~/Library/Application Support/Code/User/settings.json`
- **Linux:** `~/.config/Code/user/settings.json`

Or use shortcut:
- Press: `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type: "Preferences: Open User Settings (JSON)"
- Press Enter

---

## ✅ Checklist

Required:
- [ ] Node.js 20+ installed
- [ ] VS Code installed
- [ ] Claude extension in VS Code
- [ ] GitHub Pattern server built (`npm run build`)
- [ ] settings.json configured
- [ ] VS Code restarted

Optional:
- [ ] GitHub token obtained and added

---

## 🎯 Test It Works

Once configured, ask Claude:

```
"What are the most common error handling patterns in TypeScript?"
```

Claude will:
1. Use `suggest_code_patterns` tool
2. Your server searches GitHub
3. Analyzes 10 projects
4. Returns results with frequency
5. Shows real code examples

---

## 🐛 Troubleshooting

### Server shows ❌ (not connected)

**Check 1:** Path is correct
```json
"args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"]
```

**Check 2:** Use forward slashes `/`, not backslashes `\`

**Check 3:** Rebuild the server
```bash
npm run build
```

**Check 4:** View error in Output panel
- Open: Ctrl+Shift+U
- Select: "MCP" dropdown
- Read error message

### GitHub API rate limited

**Solution:** Add GitHub token
```json
"env": {
  "GITHUB_TOKEN": "ghp_your_actual_token"
}
```

Get one: https://github.com/settings/tokens

### Node.js command not found

**Solution:** Node.js not installed or not in PATH
```bash
node --version  # Should show v20.x.x or higher
```

Download: https://nodejs.org/

---

## 📖 File Reference

### Source Files (TypeScript)

| File | Lines | Purpose |
|------|-------|---------|
| `index.ts` | 24 | Entry point, starts server |
| `server.ts` | 100 | MCP server setup & routing |
| `tools.ts` | 130 | Tool implementations |
| `github-client.ts` | 150 | GitHub API wrapper |
| `patterns.ts` | 200 | Pattern analysis logic |
| `schemas.ts` | 30 | Input validation |
| `types.ts` | 70 | Type definitions |

### Compiled File

| File | Purpose |
|------|---------|
| `dist/index.js` | **This is what VS Code runs** |

### Documentation

| File | Audience | Content |
|------|----------|---------|
| `QUICK_START.md` | Everyone | 5-min setup, common issues |
| `MCP_VS_CODE_SETUP.md` | Detailed learners | Step-by-step guide |
| `MCP_VISUAL_GUIDE.md` | Visual learners | Diagrams and flows |
| `ARCHITECTURE.md` | Code maintainers | Code structure, design |
| `README.md` | Project overview | What it does |

---

## 🎓 Architecture Overview

Your MCP server is split into logical modules:

```
┌─────────────────────────────────────────┐
│         index.ts (Entry Point)          │
│    Starts server on stdio transport     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      server.ts (MCP Server Setup)       │
│  - ListTools handler                    │
│  - CallTool router                      │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   ┌─────────────┐   ┌──────────────────┐
   │  tools.ts   │   │   schemas.ts     │
   │ Tool logic  │   │   Validation     │
   └──────┬──────┘   └──────────────────┘
          │
    ┌─────┴────────────────┐
    ▼                      ▼
┌──────────────┐    ┌─────────────────┐
│github-     │    │  patterns.ts    │
│client.ts    │    │  Analysis logic │
│GitHub API   │    └─────────────────┘
└──────────────┘           │
        │                  │
        ▼                  ▼
   🌐 GitHub API      Analyzes code
```

---

## 🚀 Next Steps

1. **Follow QUICK_START.md** for immediate setup
2. **Test with Claude** - Ask it to search for patterns
3. **Read ARCHITECTURE.md** to understand the code
4. **Modify patterns.ts** if you want to add new patterns
5. **Use it in your workflow** - Leverage with Claude!

---

## 💬 Using with Claude

### Simple Queries
```
"Find async/await patterns in TypeScript"
"Show me error handling in Node.js projects"
"What caching strategies are popular in Go?"
```

### Complex Queries
```
"Compare error handling approaches across TypeScript, Python, and Go"
"What's the most common pattern for token refresh in OAuth?"
"Find examples of dependency injection in Java microservices"
```

### Analysis Queries
```
"Suggest the best validation library for JavaScript"
"What's the standard approach for rate limiting in REST APIs?"
"How do top projects handle database connections?"
```

---

## 📞 Support

**If something doesn't work:**

1. Check QUICK_START.md - Troubleshooting section
2. Review MCP_VS_CODE_SETUP.md - Detailed steps
3. Look at MCP_VISUAL_GUIDE.md - Understand the flow
4. Verify:
   - Path uses forward slashes `/`
   - `npm run build` succeeded
   - VS Code restarted
   - GitHub token (if using)

---

## ✨ You're Ready!

Your GitHub Pattern MCP Server is:
- ✅ Fully refactored into modular files
- ✅ Well documented
- ✅ Ready to use with Claude in VS Code
- ✅ Able to search GitHub as an agent
- ✅ Able to analyze code patterns

**Just configure settings.json and restart VS Code. Then ask Claude to search GitHub!**

---

## 🎉 Summary

| What | Where |
|------|-------|
| Start setup | QUICK_START.md |
| Setup help | MCP_VS_CODE_SETUP.md |
| Understand flow | MCP_VISUAL_GUIDE.md |
| Code structure | ARCHITECTURE.md |
| GitHub token | https://github.com/settings/tokens |
| Settings.json | Ctrl+Shift+P → "Preferences: Open User Settings (JSON)" |

**Ready? Follow QUICK_START.md!** 🚀
