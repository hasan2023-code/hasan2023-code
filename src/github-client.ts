import {
  GitHubCodeSearchItem,
  GitHubCodeSearchResponse,
  GitHubContentResponse,
  RetrievedFile,
} from "./types.js";

// ============================================================================
// GITHUB API CONFIGURATION
// ============================================================================

const GITHUB_API_BASE = "https://api.github.com";
const USER_AGENT = "github-pattern-mcp-server/0.1.0";
const GITHUB_TOKEN = (process.env.GITHUB_TOKEN ?? process.env.GITHUB_PAT ?? "").trim();

// ============================================================================
// HELPER FUNCTIONS - Text and Query Processing
// ============================================================================

/**
 * Builds a GitHub search query string with optional language filter.
 * @param problem - The problem or feature to search for
 * @param language - Optional programming language filter
 * @returns Formatted GitHub search query
 */
function buildSearchQuery(problem: string, language?: string): string {
  const normalizedProblem = problem.trim();
  const languageQualifier = language?.trim()
    ? ` language:${language.trim()}`
    : "";
  return `${normalizedProblem} in:file${languageQualifier}`;
}

/**
 * Counts unique values in an array.
 * @param values - Array of values to count
 * @returns Number of unique values
 */
export function uniqueCount(values: string[]): number {
  return new Set(values).size;
}

// ============================================================================
// GITHUB API FUNCTIONS
// ============================================================================

/**
 * Makes authenticated requests to the GitHub API.
 * @template T - The expected response data type
 * @param url - GitHub API endpoint URL
 * @returns Promise with response data and headers
 */
async function githubFetchJson<T>(url: string): Promise<{
  data: T;
  headers: Headers;
}> {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": "2022-11-28",
  });

  if (GITHUB_TOKEN) {
    headers.set("Authorization", `Bearer ${GITHUB_TOKEN}`);
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    let details = response.statusText;

    try {
      const payload = (await response.json()) as { message?: string };
      if (payload.message) {
        details = payload.message;
      }
    } catch {
      // Ignore JSON parse failures and keep status text.
    }

    if (response.status === 401) {
      throw new Error(
        "GitHub API 401: authentication failed. Ensure a valid GITHUB_TOKEN (or GITHUB_PAT) is set for the MCP server process.",
      );
    }

    throw new Error(`GitHub API ${response.status}: ${details}`);
  }

  const data = (await response.json()) as T;
  return { data, headers: response.headers };
}

/**
 * Searches GitHub code repositories using the search_github_implementations tool.
 * TOOL: search_github_implementations
 * @param problem - Problem or feature description to search for
 * @param language - Optional programming language filter
 * @param perPage - Number of results per page
 * @returns Search results with metadata
 */
export async function searchGithubCode(
  problem: string,
  language: string | undefined,
  perPage: number,
): Promise<{
  query: string;
  totalCount: number;
  items: GitHubCodeSearchItem[];
  rateRemaining: string | null;
}> {
  const query = buildSearchQuery(problem, language);
  const encodedQuery = encodeURIComponent(query);
  const url = `${GITHUB_API_BASE}/search/code?q=${encodedQuery}&sort=indexed&order=desc&per_page=${perPage}`;

  const { data, headers } = await githubFetchJson<GitHubCodeSearchResponse>(url);

  return {
    query,
    totalCount: data.total_count,
    items: data.items ?? [],
    rateRemaining: headers.get("x-ratelimit-remaining"),
  };
}

/**
 * Fetches the content of a single file from GitHub.
 * @param item - GitHub code search item
 * @returns Retrieved file content or null if fetch fails
 */
async function fetchFileContent(item: GitHubCodeSearchItem): Promise<RetrievedFile | null> {
  try {
    const { data } = await githubFetchJson<GitHubContentResponse>(item.url);

    if (!data.content || data.encoding !== "base64") {
      return null;
    }

    const decoded = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
    if (!decoded.trim()) {
      return null;
    }

    return {
      repo: item.repository.full_name,
      path: item.path,
      htmlUrl: data.html_url ?? item.html_url,
      content: decoded.slice(0, 120_000),
    };
  } catch {
    return null;
  }
}

/**
 * Fetches content for multiple files from search results.
 * @param items - Array of GitHub code search items
 * @param maxFiles - Maximum number of files to fetch
 * @returns Array of retrieved files with content
 */
export async function fetchTopFiles(
  items: GitHubCodeSearchItem[],
  maxFiles: number,
): Promise<RetrievedFile[]> {
  const selected = items.slice(0, maxFiles);
  const fetched = await Promise.all(selected.map((item) => fetchFileContent(item)));
  return fetched.filter((file): file is RetrievedFile => file !== null);
}

/**
 * Gets the configured GitHub API base URL (useful for testing and configuration)
 * @returns GitHub API base URL
 */
export function getGitHubApiBase(): string {
  return GITHUB_API_BASE;
}

/**
 * Checks if GitHub token is configured
 * @returns True if GITHUB_TOKEN or GITHUB_PAT is set
 */
export function hasGitHubToken(): boolean {
  return GITHUB_TOKEN.length > 0;
}
