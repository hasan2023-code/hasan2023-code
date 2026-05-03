import { PatternDescriptor, PatternSuggestion, RetrievedFile } from "./types.js";

// ============================================================================
// PATTERN DEFINITIONS
// ============================================================================

/**
 * Predefined patterns that represent best practices and common implementation approaches.
 * Used by the suggest_code_patterns tool to identify common practices across repositories.
 */
export const PATTERN_DESCRIPTORS: PatternDescriptor[] = [
  {
    title: "Structured Error Handling",
    description:
      "Wrap risky operations with explicit try/catch (or equivalent) and return actionable errors.",
    regexes: [/\btry\s*\{/, /\bcatch\s*\(/, /\bexcept\s+/, /\bif\s+err\s*!=\s*nil\b/],
  },
  {
    title: "Input Validation at Boundaries",
    description:
      "Validate external inputs early using schemas/assertions before executing business logic.",
    regexes: [
      /\bvalidate\w*\s*\(/i,
      /\b(schema|validator|pydantic|zod|joi|class-validator)\b/i,
      /\bassert\s*\(/,
    ],
  },
  {
    title: "Asynchronous IO and Concurrency",
    description:
      "Use async/await or concurrency primitives to handle network and IO without blocking.",
    regexes: [
      /\basync\b/,
      /\bawait\b/,
      /\bPromise\.all\b/,
      /\basyncio\.gather\b/,
      /\bgo\s+\w+\s*\(/,
    ],
  },
  {
    title: "Retry or Backoff Around Remote Calls",
    description:
      "Add retries with delay/backoff when calling external services to improve resilience.",
    regexes: [/\bretry\b/i, /\bbackoff\b/i, /\bexponential\b/i, /\bsleep\s*\(/i],
  },
  {
    title: "Clear Client Abstraction",
    description:
      "Keep transport/API concerns in dedicated client helpers instead of spreading calls everywhere.",
    regexes: [
      /\b(class|type|interface)\s+\w*Client\b/,
      /\bfunction\s+\w*Client\s*\(/,
      /\bnew\s+\w*Client\s*\(/,
    ],
  },
  {
    title: "Caching for Hot Paths",
    description:
      "Use in-memory or shared caches to avoid repeated expensive requests/computations.",
    regexes: [/\bcache\b/i, /\bmemoize\b/i, /\blru_cache\b/i, /\bredis\b/i],
  },
];

// ============================================================================
// PATTERN ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Sanitizes code snippets by normalizing whitespace and truncating to max length.
 * @param snippet - The code snippet to sanitize
 * @param maxLength - Maximum length for the output (default: 180)
 * @returns Sanitized single-line snippet
 */
export function sanitizeSnippet(snippet: string, maxLength = 180): string {
  const singleLine = snippet.replace(/\s+/g, " ").trim();
  if (singleLine.length <= maxLength) {
    return singleLine;
  }
  return `${singleLine.slice(0, maxLength - 3)}...`;
}

/**
 * Finds the first line in code that matches any of the provided regex patterns.
 * Used by the suggest_code_patterns tool.
 * @param content - File content to search through
 * @param regexes - Array of regex patterns to match
 * @returns First matching line or null
 */
export function firstMatchingLine(content: string, regexes: RegExp[]): string | null {
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.length < 8 || line.startsWith("//") || line.startsWith("#")) {
      continue;
    }

    for (const regex of regexes) {
      if (regex.test(rawLine)) {
        return sanitizeSnippet(line, 140);
      }
    }
  }

  return null;
}

/**
 * Derives pattern suggestions from analyzed files.
 * TOOL: suggest_code_patterns
 * Analyzes files to identify which best practice patterns are used most frequently.
 * @param files - Array of retrieved files to analyze
 * @returns Sorted array of pattern suggestions by frequency
 */
export function derivePatternSuggestions(files: RetrievedFile[]): PatternSuggestion[] {
  const suggestions = PATTERN_DESCRIPTORS.map((descriptor) => ({
    title: descriptor.title,
    description: descriptor.description,
    frequency: 0,
    examples: [] as PatternSuggestion["examples"],
  }));

  files.forEach((file) => {
    PATTERN_DESCRIPTORS.forEach((descriptor, index) => {
      const match = firstMatchingLine(file.content, descriptor.regexes);
      if (!match) {
        return;
      }

      const suggestion = suggestions[index];
      suggestion.frequency += 1;

      if (suggestion.examples.length < 2) {
        suggestion.examples.push({
          repo: file.repo,
          path: file.path,
          htmlUrl: file.htmlUrl,
          matchedLine: match,
        });
      }
    });
  });

  return suggestions
    .filter((suggestion) => suggestion.frequency > 0)
    .sort((a, b) => b.frequency - a.frequency);
}

/**
 * Extracts function signatures from code content.
 * Supports multiple programming languages (JavaScript, Python, Go, Java, C#).
 * @param content - Code content to extract signatures from
 * @returns Array of found function signatures
 */
export function extractFunctionSignatures(content: string): string[] {
  const signatureRegexes = [
    /^\s*(export\s+)?(async\s+)?function\s+\w+\s*\([^)]*\)/,
    /^\s*(const|let|var)\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*=>/,
    /^\s*def\s+\w+\s*\([^)]*\)\s*:/,
    /^\s*func\s+\w+\s*\([^)]*\)/,
    /^\s*(public|private|protected)?\s*(async\s+)?\w+[<>,\s\[\]]*\s+\w+\s*\([^)]*\)\s*\{/,
  ];

  const signatures: string[] = [];

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 180) {
      continue;
    }

    if (signatureRegexes.some((regex) => regex.test(trimmed))) {
      signatures.push(sanitizeSnippet(trimmed, 140));
      if (signatures.length >= 6) {
        break;
      }
    }
  }

  return signatures;
}

/**
 * Provides fallback pattern suggestions based on common function signatures.
 * TOOL: suggest_code_patterns
 * Used when pattern-based analysis yields no results.
 * @param files - Array of retrieved files to analyze
 * @returns Array of function signature-based suggestions
 */
export function deriveFallbackSuggestions(files: RetrievedFile[]): PatternSuggestion[] {
  const signatureMap = new Map<
    string,
    {
      frequency: number;
      example: { repo: string; path: string; htmlUrl: string };
    }
  >();

  files.forEach((file) => {
    const signatures = extractFunctionSignatures(file.content);

    signatures.forEach((signature) => {
      const existing = signatureMap.get(signature);
      if (existing) {
        existing.frequency += 1;
      } else {
        signatureMap.set(signature, {
          frequency: 1,
          example: { repo: file.repo, path: file.path, htmlUrl: file.htmlUrl },
        });
      }
    });
  });

  return [...signatureMap.entries()]
    .sort((a, b) => b[1].frequency - a[1].frequency)
    .slice(0, 4)
    .map(([signature, data]) => ({
      title: "Common Function Shape",
      description: "This function signature appears repeatedly and can be reused as a starting scaffold.",
      frequency: data.frequency,
      examples: [
        {
          repo: data.example.repo,
          path: data.example.path,
          htmlUrl: data.example.htmlUrl,
          matchedLine: signature,
        },
      ],
    }));
}
