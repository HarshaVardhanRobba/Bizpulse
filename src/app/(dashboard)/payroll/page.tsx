import { UserPlus, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { EmployeeSetupForm } from "./employee-setup-form";
import { PaystubViewer } from "./paystub-viewer";

export default function PayrollPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Payroll"
        description="Onboard employees and generate paystubs."
        icon={Users}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-4" />
              Add Employee
            </CardTitle>
            <CardDescription>Onboard a new employee for payroll.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeSetupForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-4" />
              Generate Paystub
            </CardTitle>
            <CardDescription>
              Tax rule applied is the one effective on the pay date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaystubViewer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
