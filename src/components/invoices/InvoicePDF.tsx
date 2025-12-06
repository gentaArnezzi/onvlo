import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import React from 'react';

// Register a standard font (optional, using default Helvetica for now)
// Font.register({ family: 'Roboto', src: '...' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  companyInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  clientInfo: {
    flexDirection: 'column',
  },
  metaInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: '#111827',
    marginBottom: 8,
  },
  table: {
    flexDirection: 'column',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    padding: 8,
  },
  colDesc: { width: '50%' },
  colQty: { width: '15%', textAlign: 'right' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },

  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  rowText: {
    fontSize: 10,
    color: '#111827',
  },
  totals: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: '#6B7280',
    width: 100,
    textAlign: 'right',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 10,
    color: '#111827',
    width: 80,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 14,
    color: '#111827',
    fontWeight: 'bold',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
});

type InvoicePDFProps = {
  invoice: any;
  items: any[];
  client: any;
  organization: any;
};

export const InvoicePDF = ({ invoice, items, client, organization }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>
            #
            {invoice.invoiceNumber}
          </Text>
        </View>
        <View style={styles.companyInfo}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{organization?.name || 'Agency Name'}</Text>
          <Text style={styles.subtitle}>{organization?.email}</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.invoiceInfo}>
        <View style={styles.clientInfo}>
          <Text style={styles.label}>BILL TO</Text>
          <Text style={styles.value}>{client?.name}</Text>
          {client?.company && <Text style={styles.value}>{client.company}</Text>}
          {client?.email && <Text style={styles.subtitle}>{client.email}</Text>}
        </View>
        <View style={styles.metaInfo}>
          <Text style={styles.label}>ISSUE DATE</Text>
          <Text style={styles.value}>
            {new Date(invoice.createdAt).toLocaleDateString()}
          </Text>

          <Text style={styles.label}>DUE DATE</Text>
          <Text style={styles.value}>
            {new Date(invoice.dueDate).toLocaleDateString()}
          </Text>

          <Text style={styles.label}>STATUS</Text>
          <Text style={{ ...styles.value, color: invoice.status === 'Paid' ? '#059669' : '#DC2626' }}>
            {invoice.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.colDesc, styles.headerText]}>DESCRIPTION</Text>
          <Text style={[styles.colQty, styles.headerText]}>QTY</Text>
          <Text style={[styles.colPrice, styles.headerText]}>PRICE</Text>
          <Text style={[styles.colTotal, styles.headerText]}>AMOUNT</Text>
        </View>
        {items.map((item, index) => (
          <View key={`item-${index}`} style={styles.tableRow}>
            <Text style={[styles.colDesc, styles.rowText]}>{item.description}</Text>
            <Text style={[styles.colQty, styles.rowText]}>{item.quantity}</Text>
            <Text style={[styles.colPrice, styles.rowText]}>
              $
              {Number(item.unitPrice).toFixed(2)}
            </Text>
            <Text style={[styles.colTotal, styles.rowText]}>
              $
              {(item.quantity * item.unitPrice).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>
            $
            {Number(invoice.subtotal).toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Tax (
            {invoice.taxRate}
            %)
          </Text>
          <Text style={styles.totalValue}>
            $
            {Number(invoice.tax).toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { fontWeight: 'bold', color: '#111827' }]}>Total</Text>
          <Text style={[styles.totalValue, styles.grandTotal]}>
            $
            {Number(invoice.total).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
        {invoice.notes && (
          <Text style={{ marginTop: 5, fontStyle: 'italic' }}>
            Note:
            {invoice.notes}
          </Text>
        )}
      </View>
    </Page>
  </Document>
);
