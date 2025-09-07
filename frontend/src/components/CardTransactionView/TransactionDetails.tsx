import React from "react";
import type { Transaction } from "../../types2";

export default function TransactionDetails({
  transaction,
}: {
  transaction: Transaction;
}) {
  // Keep the grid template in one place to align rows and vertical divider
  const gridTemplate = "200px 1fr";
  const mockFields = React.useMemo(
    () => [
      { label: "Spent from", value: "General Expenses Card (4734)" },
      { label: "Entity", value: transaction.merchantName + " LLC" },
      { label: "Memo", value: transaction.memo || "Client dinner" },
      { label: "Category", value: transaction.merchantCategory || "Restaurants" },
      { label: "Policy assessment", value: transaction.policyAssessment || "Compliant" },
      { label: "Approval status", value: transaction.approvalStatus || "Pending" },
      { label: "Date", value: transaction.date },
      { label: "Amount", value: transaction.amount },
      { label: "Receipt", value: transaction.receiptThumbUrl ? "Attached" : "Auto-verified" },
    ],
    [transaction]
  );

  return (
    <div className="relative overflow-hidden">
      {/* Header (no borders, lighter look) */}
      <div className="flex items-center justify-between text-gray-900 px-6 py-2">
        <div className="font-medium">Requirements</div>
        <div />
      </div>

      {/* Body (no borders/dividers) */}
      <div className="space-y-1">
        {mockFields.map((f) => (
          <FieldRow
            key={f.label}
            gridTemplate={gridTemplate}
            label={f.label}
            initialValue={f.value}
          />
        ))}
      </div>
    </div>
  );
}

function FieldRow({
  gridTemplate,
  label,
  initialValue,
}: {
  gridTemplate: string;
  label: string;
  initialValue: string;
}) {
  const [value, setValue] = React.useState<string>(initialValue);
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div
      className="grid items-center px-6 py-3 bg-white hover:bg-[#f6f5f3]"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      <div className="text-sm text-gray-600">{label}</div>
      <div className="flex items-center gap-3 pl-4">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full max-w-md px-0 py-1.5 text-sm bg-transparent outline-none border-0 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}


