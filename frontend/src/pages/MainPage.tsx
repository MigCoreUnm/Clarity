import React from "react";
import CardTransactionTable, { SAMPLE_TRANSACTIONS } from "../components/CardTransactionTable/CardTransactionTable";
import BottomBar from "../components/BottomBar/BottomBar";
import CardTransactionView from "../components/CardTransactionView/CardTransactionView";
import Dropdown, { type DropdownOption } from "../components/common/Dropdown";

function Avatar() {
  return (
    <div className="h-9 w-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-medium select-none">
      DW
    </div>
  );
}


export default function MainPage({ onOpenTransaction }: { onOpenTransaction: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [policyStatusFilter, setPolicyStatusFilter] = React.useState<string>("");
  const [approvalStatusFilter, setApprovalStatusFilter] = React.useState<string>("");

  const policyStatusOptions: DropdownOption[] = [
    { value: "In policy", label: "In policy" },
    { value: "Out of policy", label: "Out of policy" },
    { value: "Needs review", label: "Needs review" },
  ];

  const approvalStatusOptions: DropdownOption[] = [
    { value: "Approved", label: "Approved" },
    { value: "Pending", label: "Pending" },
    { value: "Rejected", label: "Rejected" },
  ];
  // Calculate total amount from transactions
  const calculateTotalAmount = () => {
    const total = SAMPLE_TRANSACTIONS.reduce((sum, transaction) => {
      // Parse amount string (e.g., "$712.65 USD" -> 712.65)
      const amount = parseFloat(transaction.amount.replace(/[^0-9.-]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return `$${total.toFixed(2)} USD`;
  };

  const totalAmount = calculateTotalAmount();
  const transactionCount = SAMPLE_TRANSACTIONS.length;


  const filteredTransactions = React.useMemo(() => {
    return SAMPLE_TRANSACTIONS.filter((transaction) => {
      if (transaction.groupOwner) return true;

      const matchesSearch = searchQuery === "" || 
        transaction.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.merchantCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.memo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPolicyStatus = policyStatusFilter === "" || 
        transaction.policyStatus === policyStatusFilter;

      const matchesApprovalStatus = approvalStatusFilter === "" || 
        transaction.approvalStatus === approvalStatusFilter;

      return matchesSearch && matchesPolicyStatus && matchesApprovalStatus;
    });
  }, [searchQuery, policyStatusFilter, approvalStatusFilter]);

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-16">
      {/* Header */}
      <header className="flex items-center justify-between px-8 pt-8 pb-4">
        <h1 className="text-5xl font-semibold tracking-tight">Clarity</h1>
        <div className="flex items-center gap-4">
          <button
            className="h-9 w-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M12 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6zm0 20a3 3 0 003-3H9a3 3 0 003 3z" />
            </svg>
          </button>
          <Avatar />
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-6 px-8">
          <button className="py-3 text-sm text-gray-500 hover:text-gray-700">
            Funds
          </button>
          <button className="relative py-3 text-sm font-medium text-gray-900">
            Card transactions
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-700">
              {transactionCount}
            </span>
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gray-900" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-8 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 w-[280px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 text-gray-400"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                placeholder="Search or add filter..."
                className="outline-none placeholder:text-gray-400 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dropdown
              label="Policy status"
              options={policyStatusOptions}
              value={policyStatusFilter}
              onChange={(value) => setPolicyStatusFilter(value as string)}
              placeholder="All"
            />

            <Dropdown
              label="Approval status"
              options={approvalStatusOptions}
              value={approvalStatusFilter}
              onChange={(value) => setApprovalStatusFilter(value as string)}
              placeholder="All"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>New Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="pb-10">
        <CardTransactionTable 
          onOpenTransaction={onOpenTransaction}
          transactions={filteredTransactions}
        />
      </div>

      {/* Bottom Bar */}
      <BottomBar
        currentCount={1}
        totalCount={transactionCount}
        totalAmount={totalAmount}
      />
    </div>
  );
}


