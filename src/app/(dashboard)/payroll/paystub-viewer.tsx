"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { payrollClient } from "@/lib/clients/payroll-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InlineError } from "@/components/inline-error";

export function PaystubViewer() {
  const [employeeId, setEmployeeId] = useState("");
  const [payDate, setPayDate] = useState("");
  const [grossPay, setGrossPay] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      payrollClient.generatePaystub({
        employeeId: Number(employeeId),
        payDate,
        grossPay: Number(grossPay),
      }),
  });

  const netPct = useMemo(() => {
    if (!mutation.data) return null;
    return Math.round((mutation.data.netPay / mutation.data.grossPay) * 100);
  }, [mutation.data]);

  return (
    <div className="flex flex-col gap-5">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="payDate">Pay Date</Label>
          <Input
            id="payDate"
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="grossPay">Gross Pay</Label>
          <Input
            id="grossPay"
            type="number"
            step="0.01"
            value={grossPay}
            onChange={(e) => setGrossPay(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Generating…" : "Generate Paystub"}
        </Button>
        {mutation.isError && <InlineError message={(mutation.error as Error).message} />}
      </form>

      {mutation.isSuccess && (
        <>
          <Separator />
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Paystub #{mutation.data.id}</span>
              {netPct !== null && <span>{netPct}% net</span>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gross Pay</span>
              <span>${mutation.data.grossPay.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Deductions</span>
              <span>-${mutation.data.deductions.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Net Pay</span>
              <span>${mutation.data.netPay.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
