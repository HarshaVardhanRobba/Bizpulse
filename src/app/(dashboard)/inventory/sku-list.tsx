"use client";

import { useQuery } from "@tanstack/react-query";
import { PackageSearch } from "lucide-react";
import { inventoryClient } from "@/lib/clients/inventory-client";
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

export function SkuList() {
  const {
    data: skus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["skus"],
    queryFn: inventoryClient.listSkus,
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

  if (error) return <InlineError message="Failed to load SKUs." />;

  if (skus?.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageSearch />
          </EmptyMedia>
          <EmptyTitle>No SKUs yet</EmptyTitle>
          <EmptyDescription>Add stock using the form to see it listed here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Reorder At</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skus?.map((sku) => (
          <TableRow key={sku.id}>
            <TableCell className="font-medium">{sku.skuCode}</TableCell>
            <TableCell>{sku.name}</TableCell>
            <TableCell>{sku.quantity}</TableCell>
            <TableCell>{sku.reorderThreshold}</TableCell>
            <TableCell>
              {sku.quantity <= sku.reorderThreshold ? (
                <Badge variant="destructive">Reorder</Badge>
              ) : (
                <Badge variant="secondary">OK</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
