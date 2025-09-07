export interface Policy {
  id: string;
  title: string;
  description: string;
  hiddenNotes?: string;
}

export interface PolicyGroup {
  id: string;
  title: string;
  policies: Policy[];
}

// Transaction type used throughout the app
export interface Transaction {
  id: string;
  groupOwner?: boolean;
  merchantInitials: string;
  merchantName: string;
  merchantCategory: string;
  date: string;
  amount: string;
  policyStatus: "In policy" | "Out of policy" | "Needs review" | "Analyzing..." | string;
  approvalStatus: "Approved" | "Pending" | "Rejected" | "Analyzing..." | string;
  receiptThumbUrl?: string;
  memo: string;
  approvalReason?: string;
  isAnalyzing?: boolean;
  // Optional AI suggestion attached to a transaction
  policySuggestion?: {
    content: string;
    timestamp: string;
    version: string;
  };
  // Optional assessment text for the policy
  policyAssessment?: string;
  // Who the transaction is assigned to (used for grouping)
  assignedTo?: string;
}