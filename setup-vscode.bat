@echo off
REM Quick setup script for GitHub Pattern MCP Server in VS Code

echo.
echo ========================================
echo GitHub Pattern MCP Server - VS Code Setup
echo ========================================
echo.

REM Step 1: Build the server
echo [1/3] Building server...
npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed
    exit /b 1
)
echo Done!
echo.

REM Step 2: Get absolute path
echo [2/3] Getting absolute path...
for /f "delims=" %%A in ('cd') do set "CURRENT_PATH=%%A"
set "SERVER_PATH=%CURRENT_PATH%\dist\index.js"
echo Server path: %SERVER_PATH%
echo.

REM Step 3: Display configuration
echo [3/3] VS Code Configuration needed:
echo.
echo Add this to your VS Code settings.json (Ctrl+Shift+P ^> Preferences: Open User Settings JSON):
echo.
echo {
echo   "mcpServers": {
echo     "github-patterns": {
echo       "command": "node",
echo       "args": ["%SERVER_PATH:\=/%"],
echo       "env": {
echo         "GITHUB_TOKEN": "ghp_your_github_token_here"
echo       }
echo     }
echo   }
echo }
echo.
echo Optional: Get a GitHub token from https://github.com/settings/tokens
echo.
echo Then restart VS Code!
echo.
