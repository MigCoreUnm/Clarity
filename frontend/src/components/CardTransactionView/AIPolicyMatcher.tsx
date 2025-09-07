import React, { useState } from "react";
import type { Transaction } from "../CardTransactionTable/CardTransactionTable";
import { api } from "../../services/api";

export default function AIPolicyMatcher({
  transaction,
  onTransactionUpdate,
}: {
  transaction: Transaction;
  onTransactionUpdate?: (transaction: Transaction) => void;
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    try {
      const updatedTransaction = await api.reanalyzeTransaction(transaction.id);
      if (onTransactionUpdate) {
        onTransactionUpdate(updatedTransaction);
      }
      // Force a page reload to show the updated data
      window.location.reload();
    } catch (error) {
      console.error('Failed to re-analyze transaction:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isApproved = transaction.approvalStatus === "Approved";
  const isRejected = transaction.approvalStatus === "Rejected";
  const isPending = transaction.approvalStatus === "Pending";
  
  // Determine colors based on approval status
  const borderColor = isApproved ? "border-green-200" : isRejected ? "border-red-200" : "border-yellow-200";
  const bgColor = isApproved ? "bg-green-50" : isRejected ? "bg-red-50" : "bg-yellow-50";
  const textColor = isApproved ? "text-green-800" : isRejected ? "text-red-800" : "text-yellow-800";
  const iconBgColor = isApproved ? "bg-green-100" : isRejected ? "bg-red-100" : "bg-yellow-100";
  const iconTextColor = isApproved ? "text-green-700" : isRejected ? "text-red-700" : "text-yellow-700";
  
  // Determine the title based on status
  const title = isApproved ? "Approval recommended" : isRejected ? "Rejection recommended" : "Review recommended";
  
  // Icon based on status
  const icon = isApproved ? (
    <path d="M5 13l4 4L19 7"/>
  ) : isRejected ? (
    <path d="M18 6L6 18M6 6l12 12"/>
  ) : (
    <path d="M12 9v4m0 4h.01"/>
  );
  
  return (
    <div className={`border ${borderColor} ${bgColor} ${textColor} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`h-8 w-8 rounded-full ${iconBgColor} ${iconTextColor} flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            {icon}
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          <div className="mt-2 text-sm">
            {isAnalyzing ? (
              <p>Analyzing transaction with AI...</p>
            ) : transaction.approvalReason ? (
              <p>{transaction.approvalReason}</p>
            ) : (
              <ul className="space-y-1">
                <li>Amount: {transaction.amount}</li>
                <li>Policy Status: {transaction.policyStatus}</li>
                {transaction.memo && <li>Memo: {transaction.memo}</li>}
                {transaction.receiptThumbUrl && <li>Receipt has been attached</li>}
              </ul>
            )}
          </div>
          {!transaction.approvalReason && !isAnalyzing && (
            <div className="mt-3">
              <button 
                onClick={handleReanalyze}
                disabled={isAnalyzing}
                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? "Analyzing..." : "Get AI Analysis"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


