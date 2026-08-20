import { FilePlus2, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { InvoiceCreateForm } from "./invoice-create-form";
import { InvoiceHistoryView } from "./invoice-history-view";

export default function InvoicingPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Invoicing"
        description="Create invoices and review billing history."
        icon={Receipt}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilePlus2 className="size-4" />
              New Invoice
            </CardTitle>
            <CardDescription>Deducts stock atomically on save.</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceCreateForm />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>All invoices, most recent first.</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceHistoryView />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
