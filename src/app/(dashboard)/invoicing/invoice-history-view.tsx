"use client";

import { useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import { invoicingClient } from "@/lib/clients/invoicing-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { InlineError } from "@/components/inline-error";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  issued: "secondary",
  paid: "default",
  void: "destructive",
};

export function InvoiceHistoryView() {
  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: invoicingClient.listInvoices,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <InlineError message="Failed to load invoices." />;

  if (invoices?.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ReceiptText />
          </EmptyMedia>
          <EmptyTitle>No invoices yet</EmptyTitle>
          <EmptyDescription>Create your first invoice to see it listed here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices?.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">#{invoice.id}</TableCell>
            <TableCell>{invoice.customerId}</TableCell>
            <TableCell>${invoice.total.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[invoice.status] ?? "secondary"}>
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
