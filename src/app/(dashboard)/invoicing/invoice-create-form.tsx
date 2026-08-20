"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Plus, X } from "lucide-react";
import { invoicingClient } from "@/lib/clients/invoicing-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InlineError } from "@/components/inline-error";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LineItemDraft {
  skuId: string;
  quantity: string;
  unitPrice: string;
}

const emptyLine = (): LineItemDraft => ({ skuId: "", quantity: "", unitPrice: "" });

export function InvoiceCreateForm() {
  const queryClient = useQueryClient();
  const [customerId, setCustomerId] = useState("");
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([emptyLine()]);

  const mutation = useMutation({
    mutationFn: () =>
      invoicingClient.createInvoice({
        customerId: Number(customerId),
        lineItems: lineItems.map((item) => ({
          skuId: Number(item.skuId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["skus"] });
      setCustomerId("");
      setLineItems([emptyLine()]);
    },
  });

  function updateLine(index: number, patch: Partial<LineItemDraft>) {
    setLineItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="customerId">Customer ID</Label>
        <Input
          id="customerId"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <Label>Line Items</Label>
        {lineItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              placeholder="SKU ID"
              value={item.skuId}
              onChange={(e) => updateLine(i, { skuId: e.target.value })}
              required
            />
            <Input
              placeholder="Qty"
              type="number"
              value={item.quantity}
              onChange={(e) => updateLine(i, { quantity: e.target.value })}
              required
            />
            <Input
              placeholder="Unit Price"
              type="number"
              step="0.01"
              value={item.unitPrice}
              onChange={(e) => updateLine(i, { unitPrice: e.target.value })}
              required
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={lineItems.length === 1}
                    onClick={() => setLineItems((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <X className="size-4" />
                  </Button>
                }
              />
              <TooltipContent>Remove line item</TooltipContent>
            </Tooltip>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 self-start"
          onClick={() => setLineItems((prev) => [...prev, emptyLine()])}
        >
          <Plus className="size-3.5" />
          Add Line Item
        </Button>
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Creating…" : "Create Invoice"}
      </Button>
      {mutation.isError && <InlineError message={(mutation.error as Error).message} />}
      {mutation.isSuccess && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-primary" />
          Invoice #{mutation.data.id} created — total ${mutation.data.total.toFixed(2)}.
        </p>
      )}
    </form>
  );
}
