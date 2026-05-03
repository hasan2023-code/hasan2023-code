import { z } from "zod";
// ============================================================================
// INPUT VALIDATION SCHEMAS
// ============================================================================
/**
 * Validation schema for search_github_implementations tool arguments
 */
export const SEARCH_ARGS_SCHEMA = z.object({
    problem: z.string().min(3, "problem must be at least 3 characters"),
    language: z.string().min(1).optional(),
    perPage: z.number().int().min(1).max(20).default(6),
});
/**
 * Validation schema for suggest_code_patterns tool arguments
 */
export const SUGGEST_ARGS_SCHEMA = z.object({
    problem: z.string().min(3, "problem must be at least 3 characters"),
    language: z.string().min(1).optional(),
    perPage: z.number().int().min(3).max(20).default(10),
});
