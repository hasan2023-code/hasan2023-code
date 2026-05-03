// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Represents a single code search item returned by GitHub API
 */
export type GitHubCodeSearchItem = {
  name: string;
  path: string;
  html_url: string;
  url: string;
  score: number;
  repository: {
    full_name: string;
    html_url: string;
  };
  text_matches?: Array<{
    fragment: string;
  }>;
};

/**
 * Response structure from GitHub code search API
 */
export type GitHubCodeSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubCodeSearchItem[];
};

/**
 * Response structure from GitHub content API
 */
export type GitHubContentResponse = {
  content?: string;
  encoding?: string;
  html_url?: string;
};

/**
 * Represents a retrieved file content from GitHub
 */
export type RetrievedFile = {
  repo: string;
  path: string;
  htmlUrl: string;
  content: string;
};

/**
 * Describes a pattern to search for in code
 */
export type PatternDescriptor = {
  title: string;
  description: string;
  regexes: RegExp[];
};

/**
 * Suggestion for a code pattern with frequency and examples
 */
export type PatternSuggestion = {
  title: string;
  description: string;
  frequency: number;
  examples: Array<{
    repo: string;
    path: string;
    htmlUrl: string;
    matchedLine: string;
  }>;
};

/**
 * Result from running a tool
 */
export type ToolResult = {
  text: string;
  structured: Record<string, unknown>;
};
