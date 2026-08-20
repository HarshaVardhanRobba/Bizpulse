import { Package, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { SkuList } from "./sku-list";
import { StockAdjustmentForm } from "./stock-adjustment-form";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Inventory" description="Track SKUs and stock levels." icon={Package} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>SKUs</CardTitle>
            <CardDescription>All tracked stock keeping units.</CardDescription>
          </CardHeader>
          <CardContent>
            <SkuList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-4" />
              Adjust Stock
            </CardTitle>
            <CardDescription>Apply a manual stock correction.</CardDescription>
          </CardHeader>
          <CardContent>
            <StockAdjustmentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
