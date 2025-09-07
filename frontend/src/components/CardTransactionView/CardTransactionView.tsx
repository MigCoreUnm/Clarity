import React from "react";
import { type Transaction } from "../../types2";
import AIPolicyMatcher from "./AIPolicyMatcher";
import AIPolicySuggestion from "./AIPolicySuggestion";
import TransactionDetails from "./TransactionDetails";

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface ApprovalInfo {
  status: ApprovalStatus;
  approvedBy?: string;
  timestamp?: Date;
}

export default function CardTransactionView({
  transactionId,
  transactions,
  onBack,
}: {
  transactionId: string;
  transactions: Transaction[];
  onBack: () => void;
}) {
  const [currentId, setCurrentId] = React.useState<string>(transactionId);
  const [zoom, setZoom] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [approvalStatus, setApprovalStatus] = React.useState<Record<string, ApprovalInfo>>({});
  
  React.useEffect(() => {
    setCurrentId(transactionId);
    // Reset zoom and position when transaction changes
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    // Scroll to top when opening detail view
    window.scrollTo(0, 0);
  }, [transactionId]);

  const transaction = React.useMemo(() => {
    return transactions.find((t) => t.id === currentId);
  }, [currentId, transactions]);

  // Group transactions by owner
  const groupedTransactions = React.useMemo(() => {
    const groups: { owner: Transaction | null; transactions: Transaction[] }[] = [];
    let currentGroup: { owner: Transaction | null; transactions: Transaction[] } | null = null;

    for (const t of transactions) {
      if (t.groupOwner) {
        // Start a new group
        currentGroup = { owner: t, transactions: [] };
        groups.push(currentGroup);
      } else if (currentGroup) {
        // Add to current group
        currentGroup.transactions.push(t);
      } else {
        // No group - standalone transaction
        if (groups.length === 0 || groups[groups.length - 1].owner !== null) {
          groups.push({ owner: null, transactions: [] });
        }
        groups[groups.length - 1].transactions.push(t);
      }
    }

    return groups;
  }, [transactions]);

  if (!transaction) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const handleApprove = () => {
    if (!transaction) return;
    setApprovalStatus(prev => ({
      ...prev,
      [transaction.id]: {
        status: 'approved',
        approvedBy: 'Current User', // In real app, get from auth context
        timestamp: new Date()
      }
    }));
  };

  const handleReject = () => {
    if (!transaction) return;
    setApprovalStatus(prev => ({
      ...prev,
      [transaction.id]: {
        status: 'rejected',
        approvedBy: 'Current User', // In real app, get from auth context
        timestamp: new Date()
      }
    }));
  };

  const handleUndo = () => {
    if (!transaction) return;
    setApprovalStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[transaction.id];
      return newStatus;
    });
  };

  const currentApproval = transaction ? approvalStatus[transaction.id] : undefined;

  return (
    <div
      className="grid min-h-screen bg-white"
      style={{ gridTemplateColumns: "280px 1fr 520px" }}
    >
        {/* Left: All transactions list */}
        <aside className="border-r border-gray-200 bg-gray-50 min-h-screen overflow-auto">
          <div className="px-4 py-3 sticky top-0 bg-gray-50 z-10">
            <button
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
              onClick={onBack}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>Back to Inbox</span>
            </button>
          </div>

          {/* All transactions grouped by owner */}
          <div className="py-2">
            {groupedTransactions.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.owner && (
                  <div className="px-3 py-2 bg-[#fcfbf9] border-t border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-medium select-none">
                        {group.owner.merchantInitials}
                      </div>
                      <div className="text-xs font-medium text-gray-700">
                        {group.owner.merchantName}
                      </div>
                    </div>
                  </div>
                )}
                {group.transactions.map((t) => {
                  const active = t.id === currentId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setCurrentId(t.id)}
                      className={
                        "w-full text-left px-3 py-2 flex items-center gap-3 transition-colors " +
                        (active ? "bg-[#f6f5f3]" : "bg-white hover:bg-[#f6f5f3]") +
                        (group.owner ? " pl-6" : "")
                      }
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-medium select-none">
                        {t.merchantInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {t.merchantName}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 truncate">{t.amount}</span>
                          {t.isAnalyzing && (
                            <span className="text-xs text-blue-600">Analyzing...</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Middle: Transaction details */}
        <section className="relative border-r border-gray-200 min-h-screen flex flex-col">
          <div className="px-8 py-6 space-y-6 flex-1 overflow-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl md:text-5xl font-semibold tracking-tight">
                  {transaction.amount} at {transaction.merchantName}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {transaction.assignedTo || 'Unknown'} · {transaction.merchantName} · {transaction.date} · 12:51 PM
                </div>
              </div>
            </div>

            {/* AI panels */}
            <AIPolicyMatcher key={`matcher-${currentId}`} transaction={transaction} />
            <AIPolicySuggestion key={`suggestion-${currentId}`} transaction={transaction} />

            {/* Requirements / fields */}
            <TransactionDetails transaction={transaction} />
          </div>

          {/* Sticky bottom bar within middle column */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-4 transition-all duration-300">
            {currentApproval ? (
              <div 
                className={`flex items-center justify-between px-6 py-3 animate-[fadeIn_0.5s_ease-out] ${
                  currentApproval.status === 'approved' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {currentApproval.status === 'approved' ? (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className="h-5 w-5 text-green-600"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className="h-5 w-5 text-red-600"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  )}
                  <div>
                    <span className={`font-medium ${
                      currentApproval.status === 'approved' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {currentApproval.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleUndo}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    currentApproval.status === 'approved' 
                      ? 'text-green-700 hover:bg-green-100' 
                      : 'text-red-700 hover:bg-red-100'
                  }`}
                >
                  Undo
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 w-[90%]">
                  <button 
                    onClick={handleReject}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={handleApprove}
                    className="flex-1 px-4 py-2 bg-green-700 text-white hover:bg-green-800 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right: Receipt image */}
        <aside className="bg-gray-50 min-h-screen relative flex flex-col">
          <div className="flex-1 bg-gray-100 overflow-auto relative">
            {transaction.receiptThumbUrl ? (
              <div
                className="w-full h-full flex items-start justify-center min-h-screen pt-20"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ 
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none'
                }}
              >
                <img
                  src={transaction.receiptThumbUrl}
                  alt="Receipt"
                  className="max-w-full max-h-[80vh]"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.2s',
                    objectFit: 'contain'
                  }}
                  draggable={false}
                />
              </div>
            ) : (
              <div className="h-full w-full grid place-items-center text-gray-400 text-sm min-h-screen">
                No receipt provided
              </div>
            )}
          </div>
          
          {/* Zoom controls - sticky bottom bar */}
          {transaction.receiptThumbUrl && (
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="w-8 h-8 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="w-8 h-8 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </aside>
    </div>
  );
}


