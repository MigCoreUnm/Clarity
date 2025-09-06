import React from "react";
import type { Transaction } from "../CardTransactionTable/CardTransactionTable";

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
    <div className="relative border border-gray-200 overflow-hidden">
      {/* Absolute vertical divider spanning header + rows */}
      <div className="pointer-events-none absolute left-6 right-6 top-0 bottom-0 z-0">
        <div
          style={{ left: `${200}px` }}
          className="absolute top-0 bottom-0 w-px bg-gray-200"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 text-gray-900 px-6 py-3 border-b border-gray-200">
        <div className="font-medium">Requirements</div>
        <div />
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-200">
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
  const [savedValue, setSavedValue] = React.useState<string>(initialValue);
  React.useEffect(() => {
    setValue(initialValue);
    setSavedValue(initialValue);
  }, [initialValue]);
  const hasChanges = value !== savedValue;

  return (
    <div
      className="grid items-center px-6 py-3 bg-white hover:bg-[#f6f5f3]"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      <div className="text-sm text-gray-600">{label}</div>
      <div className="flex items-center justify-between gap-3 pl-4">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full max-w-md rounded border border-gray-300 px-3 py-1.5 text-sm bg-white outline-none focus:outline-none focus:ring-0 focus:border-gray-300"
        />
        <button
          disabled={!hasChanges}
          onClick={() => setSavedValue(value)}
          className={`text-sm rounded px-3 py-1.5 ${
            hasChanges
              ? "text-gray-700 border border-gray-300 hover:bg-gray-50"
              : "text-gray-400 border border-gray-200 cursor-default"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
}


