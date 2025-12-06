'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { InvoicePDF } from './InvoicePDF';

type InvoiceDownloadButtonProps = {
  invoice: any;
  items: any[];
  client: any;
  organization: any;
};

export function InvoiceDownloadButton({
  invoice,
  items,
  client,
  organization,
}: InvoiceDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Loading PDF...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={(
        <InvoicePDF
          invoice={invoice}
          items={items}
          client={client}
          organization={organization}
        />
      )}
      fileName={`invoice-${invoice.invoiceNumber}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" className="w-full" disabled={loading}>
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
