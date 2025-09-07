import React from "react";
import CardTransactionTable from "../components/CardTransactionTable/CardTransactionTable";
import BottomBar from "../components/BottomBar/BottomBar";
import Dropdown, { type DropdownOption } from "../components/common/Dropdown";
import NewTransactionModal, { type NewTransaction } from "../components/NewTransactionModal/NewTransactionModal";
import { api, WebSocketClient } from "../services/api";
import type { Transaction } from "../types2";
import InfoModal from "../components/common/InfoModal";

function Avatar() {
  return (
    <div className="h-9 w-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-medium select-none">
      DW
    </div>
  );
}


export default function MainPage({ 
  transactions, 
  setTransactions, 
  loading,
  onOpenTransaction, 
  onOpenPolicies 
}: { 
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  loading: boolean;
  onOpenTransaction: (id: string) => void;
  onOpenPolicies: () => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [policyStatusFilter, setPolicyStatusFilter] = React.useState<string>("");
  const [approvalStatusFilter, setApprovalStatusFilter] = React.useState<string>("");
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = React.useState(false);
  const [isFundsInfoOpen, setIsFundsInfoOpen] = React.useState(false);

  // Convert a File to a Data URL for persistent storage (used for uploaded receipts)
  const fileToDataUrl = React.useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Set up WebSocket connection for real-time updates
  React.useEffect(() => {
    const wsClient = new WebSocketClient((data: any) => {
      if (data.event === 'transaction:new') {
        // Update existing transaction if it was in analyzing state
        setTransactions(prev => {
          const exists = prev.find(t => t.id === data.data.id);
          if (exists) {
            return prev.map(t => t.id === data.data.id ? data.data : t);
          }
          return [...prev, data.data];
        });
      } else if (data.event === 'transaction:updated') {
        // Update re-analyzed transaction
        setTransactions(prev => prev.map(t => t.id === data.data.id ? data.data : t));
      } else if (data.event === 'transaction:deleted') {
        setTransactions(prev => prev.filter(t => t.id !== data.data));
      }
    });
    
    return () => wsClient.close();
  }, [setTransactions]);

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
  // Calculate total amount from actual transactions (not group owners)
  const calculateTotalAmount = () => {
    const total = transactions
      .filter(t => !t.groupOwner)
      .reduce((sum, transaction) => {
        // Parse amount string (e.g., "$712.65 USD" -> 712.65)
        const amount = parseFloat(transaction.amount.replace(/[^0-9.-]/g, ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
    return `$${total.toFixed(2)} USD`;
  };

  const totalAmount = calculateTotalAmount();
  // Only count actual transactions, not group owner rows
  const transactionCount = transactions.filter(t => !t.groupOwner).length;


  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
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
  }, [transactions, searchQuery, policyStatusFilter, approvalStatusFilter]);

  const handleSaveNewTransaction = async (transaction: NewTransaction) => {
    // Generate a unique ID for the new transaction - moved outside try block
    const newId = `new-${Date.now()}`;
    
    try {
      // Prepare a persistent receipt preview if an image was uploaded
      let receiptDataUrl: string | undefined = undefined;
      if (transaction.receiptFile && transaction.receiptFile.type.startsWith('image/')) {
        try {
          receiptDataUrl = await fileToDataUrl(transaction.receiptFile);
        } catch (e) {
          console.warn('Failed to convert receipt to data URL, skipping receipt preview persistence');
          receiptDataUrl = undefined;
        }
      }

      // Create single transaction entry (no group owner)
      // Don't send policy/approval status - let backend AI determine these
      const newTransaction = {
        id: newId,
        merchantInitials: transaction.merchantName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        merchantName: transaction.merchantName,
        merchantCategory: transaction.merchantCategory || "",
        date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: transaction.amount,
        // Use data URL so the receipt persists after refresh; backend will store it
        receiptThumbUrl: receiptDataUrl,
        memo: transaction.memo,
        assignedTo: transaction.assignedTo,
        isAnalyzing: true
      };
      
      // Optimistic update - show immediately with analyzing status
      const optimisticTransaction = {
        ...newTransaction,
        policyStatus: "Analyzing...",
        approvalStatus: "Analyzing..."
      };
      
      // Find if a group exists for this person
      const groupOwnerIndex = transactions.findIndex(t => 
        t.groupOwner && t.merchantName === transaction.assignedTo
      );
      
      if (groupOwnerIndex !== -1) {
        // Group exists - find where to insert (after group owner and its transactions)
        let insertIndex = groupOwnerIndex + 1;
        while (insertIndex < transactions.length && !transactions[insertIndex].groupOwner) {
          insertIndex++;
        }
        // Insert at the end of this person's group
        setTransactions(prev => [
          ...prev.slice(0, insertIndex),
          optimisticTransaction,
          ...prev.slice(insertIndex)
        ]);
      } else {
        // No group exists - create group owner first, then add transaction
        const groupOwner = {
          id: `${transaction.assignedTo.toLowerCase().replace(/\s+/g, '-')}-owner-${Date.now()}`,
          groupOwner: true,
          merchantInitials: transaction.assignedTo.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          merchantName: transaction.assignedTo,
          merchantCategory: "",
          date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          amount: transaction.amount,
          policyStatus: "Analyzing...",
          approvalStatus: "Analyzing...",
          receiptThumbUrl: undefined,
          memo: transaction.memo,
        };
        
        // Add both group owner and transaction
        setTransactions(prev => [...prev, groupOwner, optimisticTransaction]);
      }
      
      // Send to backend for AI analysis
      const analyzedTransaction = await api.addTransaction(newTransaction);
      
      // Update with analyzed result
      setTransactions(prev => prev.map(t => 
        t.id === newId ? { ...analyzedTransaction, isAnalyzing: false } : t
      ));
      
      // If we created a new group owner, update it with the analyzed status
      if (groupOwnerIndex === -1) {
        setTransactions(prev => prev.map(t => {
          if (t.groupOwner && t.merchantName === transaction.assignedTo) {
            return {
              ...t,
              policyStatus: analyzedTransaction.policyStatus,
              approvalStatus: analyzedTransaction.approvalStatus
            };
          }
          return t;
        }));
      }
      
      console.log("New transaction added and analyzed:", analyzedTransaction);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      // Remove optimistic update on error - newId is now accessible here
      setTransactions(prev => prev.filter(t => t.id !== newId));
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      // Find the index of the group owner
      const groupIndex = transactions.findIndex(t => t.id === groupId);
      if (groupIndex === -1) return;
      
      // Find all transactions belonging to this group
      const transactionsToDelete = [groupId];
      
      // Look for transactions after the group owner until we hit another group owner or end
      for (let i = groupIndex + 1; i < transactions.length; i++) {
        if (transactions[i].groupOwner) break;
        transactionsToDelete.push(transactions[i].id);
      }
      
      // Delete all transactions in the group from backend
      await Promise.all(transactionsToDelete.map(id => api.deleteTransaction(id)));
      
      // Remove from local state
      setTransactions(prev => prev.filter(t => !transactionsToDelete.includes(t.id)));
    } catch (error) {
      console.error('Failed to delete group:', error);
      alert('Failed to delete group. Please try again.');
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      // Delete single transaction
      await api.deleteTransaction(transactionId);
      
      // Remove from local state
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 max-w-[1920px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">Clarity</h1>
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
        <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
          <button onClick={() => setIsFundsInfoOpen(true)} className="py-3 text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap">
            Funds
          </button>
          <button className="relative py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
            Card transactions
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-700">
              {transactionCount}
            </span>
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gray-900" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 w-full sm:w-[280px]">
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

            <div className="flex flex-wrap gap-2">
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
          </div>

          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button 
              onClick={onOpenPolicies}
              className="flex items-center gap-1 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>All Policies</span>
            </button>
            <button 
              onClick={() => setIsNewTransactionModalOpen(true)}
              className="flex items-center gap-1 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>New Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="pb-24 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading transactions...</div>
          </div>
        ) : (
          <CardTransactionTable 
            onOpenTransaction={onOpenTransaction}
            transactions={filteredTransactions}
            onDeleteGroup={handleDeleteGroup}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
      </div>

      {/* Bottom Bar */}
      <BottomBar
        currentCount={1}
        totalCount={transactionCount}
        totalAmount={totalAmount}
      />

      {/* New Transaction Modal */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
        onSave={handleSaveNewTransaction}
      />

      {/* Funds Info Modal */}
      <InfoModal
        isOpen={isFundsInfoOpen}
        onClose={() => setIsFundsInfoOpen(false)}
        title="Funds"
        showLogo={false}
      >
        <p className="text-sm text-gray-800">
          {"Don't worry "}
          <img
            src="/lovable-icon-bg-light.png"
            alt="Lovable"
            className="inline-block h-4 w-4 align-text-bottom mx-1"
          />
          {"Lovable is paying for this. :)"}
        </p>
      </InfoModal>
    </div>
  );
}


