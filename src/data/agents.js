/**
 * Reygent Agent Data
 * Sourced from: https://github.com/andrewevans0102/reygent/blob/develop/docs/agents.md
 */

export const agents = [
  {
    id: 'dev',
    name: 'Dev Agent',
    description: 'Writes, edits, and refactors implementation code including unit tests, following project conventions while avoiding functional test files.',
  },
  {
    id: 'qe',
    name: 'QE Agent',
    description: 'Creates functional and integration tests based on specifications, maintaining read-only access to implementation source files.',
  },
  {
    id: 'planner',
    name: 'Planner Agent',
    description: 'Validates and normalizes specifications into structured breakdowns with goals, tasks, constraints, and definitions of done.',
  },
  {
    id: 'security',
    name: 'Security Reviewer Agent',
    description: 'Conducts read-only security scans for OWASP Top 10 vulnerabilities without modifying files.',
  },
  {
    id: 'pr',
    name: 'PR Reviewer Agent',
    description: 'Reviews pull request diffs and produces structured findings including comments and recommended actions.',
  },
  {
    id: 'adhoc',
    name: 'Adhoc Agent',
    description: 'Handles freeform one-off tasks outside the standard workflow with full tool access for exploratory work.',
  },
];
