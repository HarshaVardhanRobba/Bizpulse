"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { inventoryClient } from "@/lib/clients/inventory-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InlineError } from "@/components/inline-error";

export function StockAdjustmentForm() {
  const queryClient = useQueryClient();
  const [skuId, setSkuId] = useState("");
  const [delta, setDelta] = useState("");

  const mutation = useMutation({
    mutationFn: () => inventoryClient.adjustStock(Number(skuId), Number(delta)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skus"] });
      setDelta("");
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="skuId">SKU ID</Label>
        <Input id="skuId" value={skuId} onChange={(e) => setSkuId(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="delta">Adjustment (+/-)</Label>
        <Input
          id="delta"
          type="number"
          value={delta}
          onChange={(e) => setDelta(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Adjusting…" : "Adjust Stock"}
      </Button>
      {mutation.isError && <InlineError message={(mutation.error as Error).message} />}
      {mutation.isSuccess && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-primary" />
          Stock updated.
        </p>
      )}
    </form>
  );
}
