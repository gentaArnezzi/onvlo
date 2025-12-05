import { describe, it, expect } from 'vitest';
import { replacePlaceholders, ReplacementData } from './placeholder';

describe('replacePlaceholders', () => {
  const mockData: ReplacementData = {
    client: {
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@example.com',
    },
    lead: null,
    proposal: {
      createdAt: new Date('2023-01-01'),
    },
    agency: {
      name: 'My Agency',
    },
  };

  it('should replace client placeholders', () => {
    const content = 'Hello {{client_name}} from {{client_company}} ({{client_email}})';
    const result = replacePlaceholders(content, mockData);
    expect(result).toBe('Hello John Doe from Acme Corp (john@example.com)');
  });

  it('should replace agency placeholders', () => {
    const content = 'Best regards, {{agency_name}}';
    const result = replacePlaceholders(content, mockData);
    expect(result).toBe('Best regards, My Agency');
  });

  it('should replace proposal placeholders', () => {
    const content = 'Date: {{proposal_date}}';
    const result = replacePlaceholders(content, mockData);
    // Date formatting depends on locale, but let's check it contains 2023
    expect(result).toContain('2023');
  });

  it('should handle missing data gracefully', () => {
    const emptyData: ReplacementData = {
      client: null,
      lead: null,
      proposal: null,
      agency: null,
    };
    const content = 'Hello {{client_name}}';
    const result = replacePlaceholders(content, emptyData);
    expect(result).toBe('Hello ');
  });

  it('should use lead data if client is missing', () => {
    const leadData: ReplacementData = {
      client: null,
      lead: {
        name: 'Jane Lead',
        company: 'Lead Co',
        email: 'jane@lead.com',
      },
      proposal: null,
      agency: null,
    };
    const content = 'Hello {{client_name}}';
    const result = replacePlaceholders(content, leadData);
    expect(result).toBe('Hello Jane Lead');
  });
});
