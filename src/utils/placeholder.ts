export type ReplacementData = {
  client?: {
    name: string;
    company?: string | null;
    email?: string | null;
  } | null;
  lead?: {
    name: string;
    company?: string | null;
    email?: string | null;
  } | null;
  proposal?: {
    createdAt: Date;
    // Add other proposal fields as needed
  } | null;
  agency?: {
    name: string;
  } | null;
};

export function replacePlaceholders(content: string, data: ReplacementData): string {
  let processedContent = content;

  // Client / Lead Placeholders
  const recipientName = data.client?.name || data.lead?.name || '';
  const recipientCompany = data.client?.company || data.lead?.company || '';
  const recipientEmail = data.client?.email || data.lead?.email || '';

  processedContent = processedContent.replace(/\{\{client_name\}\}/g, recipientName);
  processedContent = processedContent.replace(/\{\{client_company\}\}/g, recipientCompany);
  processedContent = processedContent.replace(/\{\{client_email\}\}/g, recipientEmail);

  // Proposal Placeholders
  if (data.proposal) {
    const dateStr = new Date(data.proposal.createdAt).toLocaleDateString();
    processedContent = processedContent.replace(/\{\{proposal_date\}\}/g, dateStr);
  }

  // Agency Placeholders
  if (data.agency) {
    processedContent = processedContent.replace(/\{\{agency_name\}\}/g, data.agency.name);
  }

  return processedContent;
}
