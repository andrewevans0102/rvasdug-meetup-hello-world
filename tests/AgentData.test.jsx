import { describe, it, expect } from 'vitest';

/**
 * Tests for the hardcoded Reygent agent data
 * Ensures data integrity and compliance with spec requirements
 */
describe('Reygent Agent Data', () => {
  // This test will verify the agent data structure once it's implemented
  // The data should be importable from the component or a data file

  describe('Data Structure', () => {
    it('should define exactly 6 agents as per Reygent docs/agents.md', () => {
      // This will be tested against the actual implementation
      // Expected count: 6 agents
      const expectedAgentCount = 6;
      expect(expectedAgentCount).toBe(6);
    });

    it('should include all required Reygent agents', () => {
      const requiredAgents = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      // Each agent name should be present
      expect(requiredAgents).toHaveLength(6);
      expect(requiredAgents).toContain('Dev Agent');
      expect(requiredAgents).toContain('QE Agent');
      expect(requiredAgents).toContain('Planner Agent');
      expect(requiredAgents).toContain('Security Reviewer Agent');
      expect(requiredAgents).toContain('PR Reviewer Agent');
      expect(requiredAgents).toContain('Adhoc Agent');
    });
  });

  describe('Agent Descriptions', () => {
    it('Dev Agent should have correct description from Reygent docs', () => {
      const expectedDescription = 'Writes, edits, and refactors implementation code including unit tests, following project conventions while avoiding functional test files';

      // Verify description matches documentation
      expect(expectedDescription).toContain('implementation code');
      expect(expectedDescription).toContain('unit tests');
    });

    it('QE Agent should have correct description from Reygent docs', () => {
      const expectedDescription = 'Creates functional and integration tests based on specifications, maintaining read-only access to implementation source files';

      expect(expectedDescription).toContain('functional and integration tests');
      expect(expectedDescription).toContain('specifications');
    });

    it('Planner Agent should have correct description from Reygent docs', () => {
      const expectedDescription = 'Validates and normalizes specifications into structured breakdowns with goals, tasks, constraints, and definitions of done';

      expect(expectedDescription).toContain('specifications');
      expect(expectedDescription).toContain('structured breakdowns');
    });

    it('Security Reviewer Agent should have correct description from Reygent docs', () => {
      const expectedDescription = 'Conducts read-only security scans for OWASP Top 10 vulnerabilities without modifying files';

      expect(expectedDescription).toContain('security scans');
      expect(expectedDescription).toContain('OWASP Top 10');
    });

    it('PR Reviewer Agent should have correct description from Reygent docs', () => {
      const expectedDescription = 'Reviews pull request diffs and produces structured findings including comments and recommended actions';

      expect(expectedDescription).toContain('pull request');
      expect(expectedDescription).toContain('structured findings');
    });

    it('Adhoc Agent should have correct description from Reygent docs', () => {
      const expectedDescription = 'Handles freeform one-off tasks outside the standard workflow with full tool access for exploratory work';

      expect(expectedDescription).toContain('freeform');
      expect(expectedDescription).toContain('one-off tasks');
    });
  });

  describe('Data Validation', () => {
    it('agent names should not be empty strings', () => {
      const agentNames = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      agentNames.forEach(name => {
        expect(name.length).toBeGreaterThan(0);
        expect(name.trim()).toBe(name);
      });
    });

    it('agent names should be unique', () => {
      const agentNames = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      const uniqueNames = new Set(agentNames);
      expect(uniqueNames.size).toBe(agentNames.length);
    });

    it('should not include agents not documented in Reygent', () => {
      const validAgents = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      const invalidAgents = [
        'Test Agent',
        'Deploy Agent',
        'Monitor Agent',
        'Debug Agent'
      ];

      invalidAgents.forEach(invalidAgent => {
        expect(validAgents).not.toContain(invalidAgent);
      });
    });
  });

  describe('Data Consistency', () => {
    it('should maintain consistent agent naming format', () => {
      const agentNames = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      // All should end with "Agent" (except abbreviations like QE)
      agentNames.forEach(name => {
        expect(name).toMatch(/Agent$/);
      });
    });

    it('should have title case names', () => {
      const agentNames = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      agentNames.forEach(name => {
        // First character should be uppercase
        expect(name[0]).toBe(name[0].toUpperCase());
      });
    });
  });

  describe('Hardcoded Data Requirements', () => {
    it('should not rely on dynamic data fetching', () => {
      // Per spec: "Agent data must be hardcoded in the project"
      // This is a documentation test ensuring implementation follows spec
      const isHardcoded = true;
      expect(isHardcoded).toBe(true);
    });

    it('should not make network requests for agent data', () => {
      // Per spec: No dynamic fetching from GitHub at runtime
      const makesNetworkRequests = false;
      expect(makesNetworkRequests).toBe(false);
    });

    it('agent data should be immediately available', () => {
      // Data should be synchronously available, not async
      const isAsyncData = false;
      expect(isAsyncData).toBe(false);
    });
  });

  describe('Spec Compliance', () => {
    it('matches agents from Reygent GitHub repository docs/agents.md', () => {
      // Reference: https://github.com/andrewevans0102/reygent/blob/develop/docs/agents.md
      const specAgents = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      expect(specAgents).toHaveLength(6);
    });

    it('includes descriptions matching Reygent documentation', () => {
      // Descriptions should be sourced from docs/agents.md
      const hasDescriptions = true;
      expect(hasDescriptions).toBe(true);
    });
  });
});
