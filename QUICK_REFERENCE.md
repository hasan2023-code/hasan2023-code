# ⚡ VS Code Configuration - Quick Reference Card

## 🎯 Do This Now (5 Minutes)

### 1. Build
```bash
cd d:\Agentic-AI-Test\gitHubMcpServer
npm run build
```

### 2. Get GitHub Token (Optional)
Visit: https://github.com/settings/tokens
- Create "token (classic)"
- Check "public_repo" scope
- Copy token

### 3. Open Settings
Press: **Ctrl+Shift+P**
Type: **Preferences: Open User Settings (JSON)**
Press: **Enter**

### 4. Paste This
```json
{
  "mcpServers": {
    "github-patterns": {
      "command": "node",
      "args": ["d:/Agentic-AI-Test/gitHubMcpServer/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here_or_leave_empty"
      }
    }
  }
}
```

### 5. Restart VS Code
Close completely. Reopen.

---

## ✅ Verify

Look for: **✓ github-patterns** in MCP panel

Green checkmark = Success! 🎉

---

## 📌 Key Points

| Point | Details |
|-------|---------|
| **Path Format** | Use forward slashes: `d:/not/d:\` |
| **File To Use** | `dist/index.js` (not `src/index.ts`) |
| **Node.js Required** | Version 20+ |
| **GitHub Token** | Optional but recommended |
| **Token Scope** | `public_repo` |

---

## 💬 Test It

Ask Claude: `Search for async error handling in TypeScript`

Claude will automatically use your MCP server! ✨

---

## ❌ If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| ❌ not ✓ | Check Output: Ctrl+Shift+U → Select "MCP" |
| Path error | Use `/` not `\` |
| "node not found" | Install Node.js v20+ |
| Rate limited | Add GitHub token to settings |
| Still broken | Read MCP_VS_CODE_SETUP.md |

---

## 📖 Full Docs

**Quick setup:** QUICK_START.md
**Visual guide:** MCP_VISUAL_GUIDE.md
**Detailed:** MCP_VS_CODE_SETUP.md
**Code structure:** ARCHITECTURE.md

---

## 🎊 You're Done!

Your MCP server is now an agent in Claude within VS Code!

Use it to:
- ✅ Search GitHub code patterns
- ✅ Analyze implementations
- ✅ Get best practices
- ✅ Understand patterns
- ✅ Find examples

**Ask Claude anything about code patterns!** 🚀
