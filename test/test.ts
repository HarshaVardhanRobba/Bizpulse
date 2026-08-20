import { db } from "../src/db";
import { employeeTable, skuTable } from "../src/db/schema";

async function seed() {
  await db.insert(skuTable).values([
    { name: "Employee A", skuCode: "WID-A", quantity: 100, reorderThreshold: 20 },
    { name: "Employee B", skuCode: "WID-B", quantity: 50, reorderThreshold: 10 },
    { name: "Employee C", skuCode: "WID-C", quantity: 0, reorderThreshold: 15 },
  ]);

  await db.insert(employeeTable).values([
    { name: "Alex Rivera", salary: "65000.00", filingStatus: "single", joiningDate: "2023-03-01" },
    {
      name: "Jordan Lee",
      salary: "82000.00",
      filingStatus: "married_joint",
      joiningDate: "2022-07-15",
    },
  ]);

  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
