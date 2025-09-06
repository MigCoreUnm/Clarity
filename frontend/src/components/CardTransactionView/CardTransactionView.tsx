import React from "react";
import { SAMPLE_TRANSACTIONS, type Transaction } from "../CardTransactionTable/CardTransactionTable";
import AIPolicyMatcher from "./AIPolicyMatcher";
import AIPolicySuggestion from "./AIPolicySuggestion";
import TransactionDetails from "./TransactionDetails";

export default function CardTransactionView({
  transactionId,
  onBack,
}: {
  transactionId: string;
  onBack: () => void;
}) {
  const transactions = SAMPLE_TRANSACTIONS;
  const [currentId, setCurrentId] = React.useState<string>(transactionId);
  React.useEffect(() => {
    setCurrentId(transactionId);
  }, [transactionId]);

  const transaction = React.useMemo(() => {
    return transactions.find((t) => t.id === currentId);
  }, [currentId]);

  // Build all groups: each owner and their subsequent member transactions
  const groups = React.useMemo(() => {
    const result: { owner: Transaction; members: Transaction[] }[] = [];
    let currentOwner: Transaction | null = null;
    for (const t of transactions) {
      if (t.groupOwner) {
        currentOwner = t;
        result.push({ owner: t, members: [] });
      } else if (currentOwner) {
        result[result.length - 1].members.push(t);
      }
    }
    return result;
  }, [transactions]);

  // Current owner of the active transaction (for header context)
  const owner = React.useMemo(() => {
    for (const group of groups) {
      if (group.members.some((m) => m.id === currentId)) return group.owner;
    }
    return undefined;
  }, [groups, currentId]);

  if (!transaction) return null;

  return (
    <div
      className="grid min-h-screen bg-white"
      style={{ gridTemplateColumns: "280px 1fr 520px" }}
    >
        {/* Left: All groups and members list */}
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
          <div className="border-t border-gray-200" />

          {/* All groups with their members */}
          <div>
            {groups.map((g) => (
              <div key={g.owner.id} className="py-1">
                {/* Owner header */}
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3 rounded-md px-3 py-2 bg-[#fcfbf9]">
                    <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-medium select-none">
                      {g.owner.merchantInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {g.owner.merchantName}
                      </div>
                      <div className="text-xs text-gray-500">Group owner</div>
                    </div>
                  </div>
                </div>

                {/* Members */}
                <div className="mt-1">
                  {g.members.map((m) => {
                    const active = m.id === currentId;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setCurrentId(m.id)}
                        className={
                          "w-full text-left px-3 py-2 flex items-center gap-3 transition-colors " +
                          (active ? "bg-[#f6f5f3]" : "bg-white hover:bg-[#f6f5f3]")
                        }
                      >
                        <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-medium select-none">
                          {m.merchantInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {m.merchantName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{m.amount}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
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
                  {owner?.merchantName} · {transaction.merchantName} · {transaction.date} · 12:51 PM
                </div>
              </div>
            </div>

            {/* AI panels */}
            <AIPolicyMatcher amount={transaction.amount} memo={transaction.memo} />
            <AIPolicySuggestion />

            {/* Requirements / fields */}
            <TransactionDetails transaction={transaction} />
          </div>

          {/* Sticky bottom bar within middle column */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Review this transaction</div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">Reject</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Receipt image */}
        <aside className="bg-gray-50 p-6 min-h-screen overflow-auto">
          <div className="border border-gray-200 bg-white rounded-md p-2">
            <div className="aspect-[3/5] w-full bg-gray-100 overflow-hidden rounded">
              {transaction.receiptThumbUrl ? (
                <img
                  src={transaction.receiptThumbUrl}
                  alt="Receipt"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-gray-400 text-sm">
                  No receipt provided
                </div>
              )}
            </div>
          </div>
        </aside>
    </div>
  );
}


