"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { payrollClient, type FilingStatus } from "@/lib/clients/payroll-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineError } from "@/components/inline-error";

const FILING_STATUSES: FilingStatus[] = ["single", "married", "head_of_household"];

export function EmployeeSetupForm() {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [joiningDate, setJoiningDate] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      payrollClient.setupEmployee({
        name,
        salary: Number(salary),
        filingStatus,
        joiningDate,
      }),
    onSuccess: () => {
      setName("");
      setSalary("");
      setJoiningDate("");
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="salary">Annual Salary</Label>
        <Input
          id="salary"
          type="number"
          step="0.01"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filingStatus">Filing Status</Label>
        <Select
          value={filingStatus}
          onValueChange={(value) => setFilingStatus(value as FilingStatus)}
        >
          <SelectTrigger id="filingStatus" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILING_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="joiningDate">Joining Date</Label>
        <Input
          id="joiningDate"
          type="date"
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Saving…" : "Add Employee"}
      </Button>
      {mutation.isError && <InlineError message={(mutation.error as Error).message} />}
      {mutation.isSuccess && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-primary" />
          Employee #{mutation.data.id} ({mutation.data.name}) added.
        </p>
      )}
    </form>
  );
}
