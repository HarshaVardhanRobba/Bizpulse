import Link from "next/link";
import { ArrowRight, Package, Receipt, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const SECTIONS = [
  {
    href: "/inventory",
    title: "Inventory",
    description: "Track SKUs and stock levels in real time.",
    icon: Package,
  },
  {
    href: "/invoicing",
    title: "Invoicing",
    description: "Create invoices and review billing history.",
    icon: Receipt,
  },
  {
    href: "/payroll",
    title: "Payroll",
    description: "Onboard employees and generate paystubs.",
    icon: Users,
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Overview" description="Pick a workspace to get started." />

      <div className="grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <div className="mb-1 flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {section.title}
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
