import React, { useState, useRef, useEffect } from "react";
import type { Transaction } from "../../types2";

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
  onDeleteGroup,
  onDeleteTransaction,
}: {
  transaction: Transaction;
  isSelected?: boolean;
  onToggle?: () => void;
  groupCheckbox?: GroupCheckboxProps;
  onOpen?: (id: string) => void;
  onDeleteGroup?: (id: string) => void;
  onDeleteTransaction?: (id: string) => void;
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

  const [isHovered, setIsHovered] = React.useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rowClasses = groupOwner
    ? "relative z-10 bg-[#fcfbf9] group"
    : "bg-white hover:bg-[#f6f5f3] cursor-pointer";

  const groupCheckboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (groupCheckboxRef.current) {
      groupCheckboxRef.current.indeterminate = Boolean(groupCheckbox?.indeterminate);
    }
  }, [groupCheckbox?.indeterminate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (groupOwner || !onOpen) return;
    const target = e.target as Element | null;
    if (target && (target.closest("button, a, input, textarea, select, label, [role='button']") as Element | null)) {
      return;
    }
    onOpen(transaction.id);
  };

  const downloadTransactionJson = () => {
    try {
      const jsonString = JSON.stringify(transaction, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transaction-${transaction.id}.json`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download transaction JSON", error);
    }
  };

  return (
    <div
      className={"grid items-center px-6 py-3 min-w-fit " + rowClasses + " " +
        "grid-cols-[minmax(50px,0.5fr)_minmax(150px,3fr)_minmax(100px,1.5fr)_minmax(120px,1.5fr)_15px] " +
        "md:grid-cols-[minmax(60px,0.5fr)_minmax(180px,2.5fr)_minmax(90px,1fr)_minmax(100px,1.2fr)_minmax(130px,1.3fr)_minmax(60px,0.5fr)_minmax(120px,1.5fr)_15px] " +
        "lg:grid-cols-[minmax(60px,0.5fr)_minmax(200px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(140px,1.2fr)_minmax(60px,0.5fr)_minmax(120px,1.5fr)_minmax(100px,1fr)_15px]"}
      onClick={handleRowClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      <div className="flex items-center gap-3 px-3 relative">
        <div className="h-9 w-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-medium select-none">
          {merchantInitials}
        </div>
        <button
          type="button"
          className="text-left flex-1"
          onClick={() => {
            if (!groupOwner && onOpen) onOpen(transaction.id);
          }}
          aria-label="Open transaction details"
        >
          <div className="font-medium text-gray-900">
            {merchantName}
          </div>
          {!groupOwner && merchantCategory && (
            <div className="text-sm text-gray-500">{merchantCategory}</div>
          )}
        </button>
        {groupOwner && (
          <div className={`flex items-center gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              className="p-1 hover:bg-red-100 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteGroup) {
                  onDeleteGroup(transaction.id);
                }
              }}
              aria-label="Delete group"
              title="Delete group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-red-600">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Date */}
      <div className="text-gray-700 text-left px-3 hidden md:block">
        {!groupOwner && date}
      </div>

      {/* Amount */}
      <div className="text-gray-900 text-right px-3">
        {!groupOwner && amount}
      </div>

      {/* Policy */}
      <div className="text-left px-3 truncate">
        {!groupOwner && (
          <span className={`inline-flex items-center gap-1 md:gap-2 rounded-full px-2 md:px-2.5 py-0.5 md:py-1 text-xs md:text-sm border whitespace-nowrap ${
            policyStatus === "Analyzing..." 
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : policyStatus === "In policy" 
              ? "bg-green-50 text-green-700 border-green-200"
              : policyStatus === "Out of policy"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-orange-50 text-orange-700 border-orange-200"
          }`}>
            {policyStatus === "Analyzing..." ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3 w-3 md:h-4 md:w-4 animate-spin"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3 w-3 md:h-4 md:w-4"
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
            )}
            {policyStatus}
          </span>
        )}
      </div>

      {/* Receipt */}
      <div className="hidden md:flex justify-center px-2">
        {!groupOwner && (
          receiptThumbUrl ? (
            <div className="h-10 w-8 rounded overflow-hidden border border-gray-200 bg-gray-100">
              <img
                src={receiptThumbUrl}
                alt="Receipt thumbnail"
                className="h-full w-full object-cover"
              />
            </div>
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
      <div className="text-gray-700 text-left px-3 hidden md:block truncate">
        {!groupOwner && memo}
      </div>

      {/* Actions */}
      <div className="hidden lg:flex items-center gap-1.5 justify-center px-3">
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
      <div className="flex items-center justify-center relative">
        {!groupOwner && (
          <div ref={dropdownRef} className="relative">
            <button 
              aria-label="More options" 
              className="flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-600">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('View details:', transaction.id);
                    if (onOpen) onOpen(transaction.id);
                    setShowDropdown(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View details
                </button>
                
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadTransactionJson();
                    setShowDropdown(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M12 3v12" />
                    <path d="M8 11l4 4 4-4" />
                    <path d="M5 19h14" />
                  </svg>
                  Download
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this transaction?')) {
                      if (onDeleteTransaction) {
                        onDeleteTransaction(transaction.id);
                      }
                      setShowDropdown(false);
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


