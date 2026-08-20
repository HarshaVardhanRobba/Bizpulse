import Link from "next/link";
import { ArrowRight, Package, Receipt, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FEATURES = [
  { icon: Package, title: "Inventory", description: "Real-time stock, no overselling." },
  { icon: Receipt, title: "Invoicing", description: "Stock-linked, atomic invoicing." },
  { icon: Users, title: "Payroll", description: "Reproducible tax-versioned paystubs." },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-14 px-6 py-20 text-center">
      <div className="flex flex-col items-center gap-5">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Run your business on one system
        </span>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Bizpulse</h1>

        <p className="max-w-md text-balance text-muted-foreground">
          Inventory, invoicing, and payroll — connected, so stock and money never drift apart.
        </p>

        <Button size="lg" className="mt-2 gap-1.5" render={<Link href="/dashboard" />}>
          Check In
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="text-left">
              <CardHeader>
                <div className="mb-1 flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <CardTitle className="text-sm">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
