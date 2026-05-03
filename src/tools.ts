import { SearchArgs, SuggestArgs } from "./schemas.js";
import { ToolResult } from "./types.js";
import {
  searchGithubCode,
  fetchTopFiles,
  uniqueCount,
  hasGitHubToken,
} from "./github-client.js";
import {
  derivePatternSuggestions,
  deriveFallbackSuggestions,
  sanitizeSnippet,
} from "./patterns.js";

// ============================================================================
// MCP TOOL HANDLERS
// ============================================================================

/**
 * TOOL: search_github_implementations
 * Searches GitHub for implementations matching a problem description.
 * Returns relevant implementation files with metadata and code snippets.
 * @param args - Tool arguments (problem, language, perPage)
 * @returns Text and structured search results
 */
export async function runSearchTool(args: SearchArgs): Promise<ToolResult> {
  const search = await searchGithubCode(args.problem, args.language, args.perPage);
  const repositories = [...new Set(search.items.map((item) => item.repository.full_name))];

  const lines: string[] = [];
  lines.push(`Query: ${search.query}`);
  lines.push(`Total code matches: ${search.totalCount}`);
  lines.push(`Returned matches: ${search.items.length}`);
  lines.push(`Repositories represented: ${repositories.length}`);

  if (search.rateRemaining) {
    lines.push(`GitHub API remaining requests: ${search.rateRemaining}`);
  }

  if (search.items.length === 0) {
    lines.push("No matches found. Try broadening the problem phrase or removing language filters.");
  } else {
    search.items.forEach((item, index) => {
      lines.push("");
      lines.push(`${index + 1}. ${item.repository.full_name}/${item.path}`);
      lines.push(`   URL: ${item.html_url}`);
      if (item.text_matches?.[0]?.fragment) {
        lines.push(`   Snippet: ${sanitizeSnippet(item.text_matches[0].fragment)}`);
      }
    });
  }

  if (!hasGitHubToken()) {
    lines.push("");
    lines.push(
      "Tip: set GITHUB_TOKEN (or GITHUB_PAT) to increase search rate limits and reliability.",
    );
  }

  return {
    text: lines.join("\n"),
    structured: {
      query: search.query,
      totalMatches: search.totalCount,
      repositories,
      matches: search.items.map((item) => ({
        repository: item.repository.full_name,
        path: item.path,
        url: item.html_url,
        score: item.score,
      })),
    },
  };
}

/**
 * TOOL: suggest_code_patterns
 * Analyzes GitHub implementations and suggests reusable code patterns.
 * Identifies best practices used across repositories with frequency and examples.
 * @param args - Tool arguments (problem, language, perPage)
 * @returns Text and structured pattern suggestions
 */
export async function runSuggestTool(args: SuggestArgs): Promise<ToolResult> {
  const search = await searchGithubCode(args.problem, args.language, args.perPage);

  if (search.items.length === 0) {
    return {
      text: `No implementation matches found for query: ${search.query}`,
      structured: {
        query: search.query,
        analyzedFiles: 0,
        patterns: [],
      },
    };
  }

  const files = await fetchTopFiles(search.items, Math.min(args.perPage, 10));
  let patterns = derivePatternSuggestions(files);

  // Fallback to function signature analysis if no patterns found
  if (patterns.length === 0) {
    patterns = deriveFallbackSuggestions(files);
  }

  const topPatterns = patterns.slice(0, 5);
  const repositoryCount = uniqueCount(files.map((file) => file.repo));

  const lines: string[] = [];
  lines.push(`Query: ${search.query}`);
  lines.push(`Analyzed files: ${files.length}`);
  lines.push(`Repositories sampled: ${repositoryCount}`);

  if (files.length === 0) {
    lines.push("Unable to fetch file contents from GitHub results; try again or refine the query.");
  } else if (topPatterns.length === 0) {
    lines.push("No stable pattern signal detected from sampled implementations.");
  } else {
    topPatterns.forEach((pattern, index) => {
      lines.push("");
      lines.push(`${index + 1}. ${pattern.title} (${pattern.frequency}/${files.length} files)`);
      lines.push(`   Why it matters: ${pattern.description}`);

      pattern.examples.forEach((example) => {
        lines.push(`   Example: ${example.repo}/${example.path}`);
        lines.push(`   Code: ${example.matchedLine}`);
        lines.push(`   URL: ${example.htmlUrl}`);
      });
    });
  }

  if (!hasGitHubToken()) {
    lines.push("");
    lines.push(
      "Tip: set GITHUB_TOKEN (or GITHUB_PAT) to reduce rate-limit errors during pattern extraction.",
    );
  }

  return {
    text: lines.join("\n"),
    structured: {
      query: search.query,
      analyzedFiles: files.length,
      repositoriesAnalyzed: repositoryCount,
      patterns: topPatterns,
    },
  };
}
