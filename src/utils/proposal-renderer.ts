export type ProposalData = {
  client_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  price?: string | number;
  scope?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
};

export function renderProposalTemplate(
  template: string,
  data: ProposalData,
): string {
  let rendered = template;

  // Replace all placeholders
  Object.keys(data).forEach((key) => {
    const placeholder = `{{${key}}}`;
    const value = data[key]?.toString() || '';
    rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
  });

  // Format common placeholders if they exist
  if (data.price !== undefined) {
    rendered = rendered.replace(
      /\{\{price\}\}/g,
      typeof data.price === 'number'
        ? `$${data.price.toFixed(2)}`
        : data.price.toString(),
    );
  }

  if (data.start_date) {
    rendered = rendered.replace(
      /\{\{start_date\}\}/g,
      new Date(data.start_date).toLocaleDateString(),
    );
  }

  if (data.end_date) {
    rendered = rendered.replace(
      /\{\{end_date\}\}/g,
      new Date(data.end_date).toLocaleDateString(),
    );
  }

  return rendered;
}

export function extractPlaceholders(template: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const placeholders: string[] = [];
  let match;

  do {
    match = regex.exec(template);
    if (match && match[1] && !placeholders.includes(match[1])) {
      placeholders.push(match[1]);
    }
  } while (match !== null);

  return placeholders;
}
