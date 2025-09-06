import React from "react";
import type { Transaction } from "./CardTransactionTable";

type GroupCheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onToggle: () => void;
};

export default function CardTransactionRow({
  transaction,
  isSelected,
  onToggle,
  groupCheckbox,
  onOpen,
}: {
  transaction: Transaction;
  isSelected?: boolean;
  onToggle?: () => void;
  groupCheckbox?: GroupCheckboxProps;
  onOpen?: (id: string) => void;
}) {
  const {
    groupOwner,
    merchantInitials,
    merchantName,
    merchantCategory,
    date,
    amount,
    policyStatus,
    receiptThumbUrl,
    memo,
  } = transaction;

  const rowClasses = groupOwner
    ? "relative z-10 bg-[#fcfbf9]"
    : "bg-white hover:bg-[#f6f5f3] cursor-pointer";

  const groupCheckboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (groupCheckboxRef.current) {
      groupCheckboxRef.current.indeterminate = Boolean(groupCheckbox?.indeterminate);
    }
  }, [groupCheckbox?.indeterminate]);

  const handleRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (groupOwner || !onOpen) return;
    const target = e.target as Element | null;
    if (target && (target.closest("button, a, input, textarea, select, label, [role='button']") as Element | null)) {
      return;
    }
    onOpen(transaction.id);
  };

  return (
    <div
      className={"grid items-center px-6 py-3 " + rowClasses}
      style={{
        gridTemplateColumns:
          "92px 456px 205px 223px 223px 104px 205px 155px 15px",
      }}
      onClick={handleRowClick}
    >
      {/* Checkbox */}
      <div className="flex items-center justify-center px-2">
        {groupOwner ? (
          <input
            ref={groupCheckboxRef}
            type="checkbox"
            className="h-4 w-4 accent-gray-700 border-gray-400"
            checked={Boolean(groupCheckbox?.checked)}
            onChange={groupCheckbox?.onToggle}
            aria-label="Select all transactions in group"
            title="Select all in group"
          />
        ) : (
          <input
            type="checkbox"
            className="h-4 w-4 accent-gray-700 border-gray-400"
            checked={Boolean(isSelected)}
            onChange={onToggle}
            aria-label="Select transaction"
            title="Select transaction"
          />
        )}
      </div>

      {/* Merchant */}
      <div className="flex items-center gap-3 px-3">
        <div className="h-9 w-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-medium select-none">
          {merchantInitials}
        </div>
        <button
          type="button"
          className="text-left"
          onClick={() => {
            if (!groupOwner && onOpen) onOpen(transaction.id);
          }}
          aria-label="Open transaction details"
        >
          <div className="font-medium text-gray-900 underline-offset-2 hover:underline">
            {merchantName}
          </div>
          {!groupOwner && merchantCategory && (
            <div className="text-sm text-gray-500">{merchantCategory}</div>
          )}
        </button>
      </div>

      {/* Date */}
      <div className="text-gray-700 text-left px-3">
        {!groupOwner && date}
      </div>

      {/* Amount */}
      <div className="text-gray-900 text-right px-3">
        {!groupOwner && amount}
      </div>

      {/* Policy */}
      <div className="text-left px-3">
        {!groupOwner && (
          <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-sm border ${
            policyStatus === "In policy" 
              ? "bg-green-50 text-green-700 border-green-200"
              : policyStatus === "Out of policy"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-orange-50 text-orange-700 border-orange-200"
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              {policyStatus === "In policy" ? (
                <path d="M5 13l4 4L19 7" />
              ) : policyStatus === "Out of policy" ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </>
              )}
            </svg>
            {policyStatus}
          </span>
        )}
      </div>

      {/* Receipt */}
      <div className="flex justify-center px-2">
        {!groupOwner && (
          receiptThumbUrl ? (
            <div className="h-10 w-8 rounded overflow-hidden border border-gray-200 bg-gray-100"></div>
          ) : (
            <div className="h-5 w-5 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M20 6l-11 11L4 12" />
              </svg>
            </div>
          )
        )}
      </div>

      {/* Memo */}
      <div className="text-gray-700 text-left px-3">
        {!groupOwner && memo}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 justify-center px-3">
        {!groupOwner && (
          <>
            <button className="h-12 w-12 border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50" aria-label="Reply">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-600">
                <path d="M9 14l-4-4 4-4" />
                <path d="M20 20v-7a4 4 0 00-4-4H5" />
              </svg>
            </button>
            <button className="h-12 w-12 border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50" aria-label="Approve">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-green-600">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Kebab dedicated column */}
      <div className="flex items-center justify-center">
        {!groupOwner && (
          <button aria-label="More options" className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-600">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}


