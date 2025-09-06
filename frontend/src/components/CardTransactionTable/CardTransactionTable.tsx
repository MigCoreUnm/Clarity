import React from "react";
import CardTransactionRow from "./CardTransactionRow";

type Transaction = {
  id: string;
  groupOwner?: boolean;
  merchantInitials: string;
  merchantName: string;
  merchantCategory: string;
  date: string;
  amount: string;
  policyStatus: "In policy" | "Out of policy" | "Needs review";
  approvalStatus: "Approved" | "Pending" | "Rejected";
  receiptThumbUrl?: string;
  memo: string;
};

const SAMPLE_TRANSACTIONS: Transaction[] = [
  // Group 1: Angela Martin - Client Entertainment
  {
    id: "1",
    groupOwner: true,
    merchantInitials: "AM",
    merchantName: "Angela Martin",
    merchantCategory: "",
    date: "Jul 7, 2025",
    amount: "$1,425.30 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "",
  },
  {
    id: "2",
    merchantInitials: "U",
    merchantName: "Uluh",
    merchantCategory: "Restaurants",
    date: "Jul 7, 2025",
    amount: "$712.65 USD",
    policyStatus: "In policy",
    approvalStatus: "Pending",
    receiptThumbUrl: "/public/vite.svg",
    memo: "Client dinner",
  },
  {
    id: "3",
    merchantInitials: "L",
    merchantName: "Lyft",
    merchantCategory: "Taxi and Rideshare",
    date: "Jul 7, 2025",
    amount: "$78.00 USD",
    policyStatus: "In policy",
    approvalStatus: "Pending",
    receiptThumbUrl: undefined,
    memo: "Transport to client dinner",
  },
  {
    id: "4",
    merchantInitials: "NY",
    merchantName: "N.Y. Grill & Deli",
    merchantCategory: "Restaurants",
    date: "Jul 7, 2025",
    amount: "$634.65 USD",
    policyStatus: "Out of policy",
    approvalStatus: "Rejected",
    receiptThumbUrl: undefined,
    memo: "Exceeded per-person limit",
  },
  
  // Group 2: Michael Scott - Conference Travel
  {
    id: "5",
    groupOwner: true,
    merchantInitials: "MS",
    merchantName: "Michael Scott",
    merchantCategory: "",
    date: "Jul 10, 2025",
    amount: "$2,156.43 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "",
  },
  {
    id: "6",
    merchantInitials: "UA",
    merchantName: "United Airlines",
    merchantCategory: "Airlines",
    date: "Jul 10, 2025",
    amount: "$892.00 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: "/public/vite.svg",
    memo: "Flight to NYC conference",
  },
  {
    id: "7",
    merchantInitials: "HI",
    merchantName: "Hilton Hotels",
    merchantCategory: "Hotels & Lodging",
    date: "Jul 11, 2025",
    amount: "$1,264.43 USD",
    policyStatus: "Needs review",
    approvalStatus: "Pending",
    receiptThumbUrl: "/public/vite.svg",
    memo: "3 nights accommodation",
  },
  
  // Group 3: Pam Beesly - Office Supplies
  {
    id: "8",
    groupOwner: true,
    merchantInitials: "PB",
    merchantName: "Pam Beesly",
    merchantCategory: "",
    date: "Jul 12, 2025",
    amount: "$487.23 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "",
  },
  {
    id: "9",
    merchantInitials: "OS",
    merchantName: "Office Supply Co",
    merchantCategory: "Office Supplies",
    date: "Jul 12, 2025",
    amount: "$234.56 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "Printer paper and toner",
  },
  {
    id: "10",
    merchantInitials: "BB",
    merchantName: "Best Buy",
    merchantCategory: "Electronics",
    date: "Jul 12, 2025",
    amount: "$252.67 USD",
    policyStatus: "Needs review",
    approvalStatus: "Pending",
    receiptThumbUrl: "/public/vite.svg",
    memo: "Wireless mouse and keyboards",
  },
  
  // Group 4: Jim Halpert - Team Building Event
  {
    id: "11",
    groupOwner: true,
    merchantInitials: "JH",
    merchantName: "Jim Halpert",
    merchantCategory: "",
    date: "Jul 15, 2025",
    amount: "$1,845.00 USD",
    policyStatus: "Out of policy",
    approvalStatus: "Rejected",
    receiptThumbUrl: undefined,
    memo: "",
  },
  {
    id: "12",
    merchantInitials: "TG",
    merchantName: "TopGolf",
    merchantCategory: "Entertainment",
    date: "Jul 15, 2025",
    amount: "$1,200.00 USD",
    policyStatus: "Out of policy",
    approvalStatus: "Rejected",
    receiptThumbUrl: undefined,
    memo: "Team building - unapproved venue",
  },
  {
    id: "13",
    merchantInitials: "DD",
    merchantName: "DoorDash",
    merchantCategory: "Food Delivery",
    date: "Jul 15, 2025",
    amount: "$345.00 USD",
    policyStatus: "Out of policy",
    approvalStatus: "Rejected",
    receiptThumbUrl: "/public/vite.svg",
    memo: "Food delivery for team event",
  },
  {
    id: "14",
    merchantInitials: "UB",
    merchantName: "Uber",
    merchantCategory: "Taxi and Rideshare",
    date: "Jul 15, 2025",
    amount: "$300.00 USD",
    policyStatus: "Out of policy",
    approvalStatus: "Rejected",
    receiptThumbUrl: undefined,
    memo: "Transportation for team",
  },
  
  // Group 5: Dwight Schrute - Client Visits
  {
    id: "15",
    groupOwner: true,
    merchantInitials: "DS",
    merchantName: "Dwight Schrute",
    merchantCategory: "",
    date: "Jul 18, 2025",
    amount: "$923.18 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "",
  },
  {
    id: "16",
    merchantInitials: "EN",
    merchantName: "Enterprise Rent-A-Car",
    merchantCategory: "Car Rental",
    date: "Jul 18, 2025",
    amount: "$456.78 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: "/public/vite.svg",
    memo: "3-day rental for client visits",
  },
  {
    id: "17",
    merchantInitials: "SH",
    merchantName: "Shell",
    merchantCategory: "Gas Stations",
    date: "Jul 19, 2025",
    amount: "$87.40 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "Fuel for rental car",
  },
  {
    id: "18",
    merchantInitials: "CP",
    merchantName: "Chili's",
    merchantCategory: "Restaurants",
    date: "Jul 19, 2025",
    amount: "$379.00 USD",
    policyStatus: "Needs review",
    approvalStatus: "Pending",
    receiptThumbUrl: "/public/vite.svg",
    memo: "Client lunch meeting",
  },
];

export default function CardTransactionTable({
  onOpenTransaction,
  transactions = SAMPLE_TRANSACTIONS,
}: {
  onOpenTransaction?: (id: string) => void;
  transactions?: Transaction[];
}) {
  // Keep the grid template in one place to align header, rows, and dividers
  const gridTemplate =
    "92px 456px 205px 223px 223px 104px 205px 155px 15px";

  // Compute cumulative left offsets for vertical dividers based on the template above.
  // Since we have fixed pixel columns, we can hardcode the cumulative sums to keep things simple and avoid layout reads.
  const dividerPositionsPx = [
    92, // after Select
    92 + 456, // after Merchant
    92 + 456 + 205, // after Date
    92 + 456 + 205 + 223, // after Amount
    92 + 456 + 205 + 223 + 223, // after Policy
    92 + 456 + 205 + 223 + 223 + 104, // after Receipt
    92 + 456 + 205 + 223 + 223 + 104 + 205, // after Memo
    92 + 456 + 205 + 223 + 223 + 104 + 205 + 155, // after Actions
  ];

  // Selection state for individual transactions (non-group rows)
  const selectableIds = React.useMemo(
    () => transactions.filter((t) => !t.groupOwner).map((t) => t.id),
    [transactions]
  );

  // Map group owner -> member transaction ids
  const ownerToMembers = React.useMemo(() => {
    const map = new Map<string, string[]>();
    let currentOwnerId: string | null = null;
    for (const t of transactions) {
      if (t.groupOwner) {
        currentOwnerId = t.id;
        if (!map.has(t.id)) map.set(t.id, []);
      } else if (currentOwnerId) {
        map.get(currentOwnerId)!.push(t.id);
      }
    }
    return map;
  }, [transactions]);

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const allChecked =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedIds.has(id));
  const someChecked =
    !allChecked && selectableIds.some((id) => selectedIds.has(id));

  const headerCheckboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someChecked && !allChecked;
    }
  }, [someChecked, allChecked]);

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const everySelected =
        selectableIds.length > 0 &&
        selectableIds.every((id) => prev.has(id));
      return everySelected ? new Set() : new Set(selectableIds);
    });
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleGroup = (ownerId: string) => {
    const memberIds = ownerToMembers.get(ownerId) || [];
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const groupAllSelected =
        memberIds.length > 0 && memberIds.every((id) => next.has(id));
      if (groupAllSelected) {
        for (const id of memberIds) next.delete(id);
      } else {
        for (const id of memberIds) next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="relative rounded-none border-y border-gray-200 overflow-hidden">
      {/* Absolute vertical dividers that span header + body + footer */}
      <div className="pointer-events-none absolute left-6 right-6 top-0 bottom-0 z-0">
        {dividerPositionsPx.map((leftPx, idx) => (
          <div
            key={idx}
            style={{ left: `${leftPx}px` }}
            className="absolute top-0 bottom-0 w-px bg-gray-200"
          />
        ))}
      </div>

      {/* Overlay the first divider (between Select and Merchant) above rows */}
      <div className="pointer-events-none absolute left-6 right-6 top-0 bottom-0 z-20">
        <div
          style={{ left: `${dividerPositionsPx[0]}px` }}
          className="absolute top-0 bottom-0 w-px bg-gray-200"
        />
      </div>

      {/* Header */}
      <div
        className="grid items-center bg-gray-50 text-gray-600 text-xs tracking-wide px-6 py-3"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <div className="flex items-center justify-center px-2">
          <input
            ref={headerCheckboxRef}
            type="checkbox"
            className="h-4 w-4 accent-gray-700 border-gray-400"
            checked={allChecked}
            onChange={toggleAll}
            aria-label="Select all transactions"
            title="Select all"
          />
        </div>
        <div className="px-3">Merchant</div>
        <div className="text-left px-3">Date</div>
        <div className="text-right px-3">Amount</div>
        <div className="text-left px-3">Policy assessment</div>
        <div className="text-center px-2">Receipt</div>
        <div className="text-left px-3">Memo</div>
        <div className="text-left px-3">Actions</div>
        <div className="text-center px-2">&nbsp;</div>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-200">
        {transactions.map((t) => {
          const memberIds = t.groupOwner ? ownerToMembers.get(t.id) || [] : [];
          const groupAllSelected =
            t.groupOwner &&
            memberIds.length > 0 &&
            memberIds.every((id) => selectedIds.has(id));
          const groupSomeSelected =
            t.groupOwner &&
            memberIds.some((id) => selectedIds.has(id)) &&
            !groupAllSelected;
          return (
            <React.Fragment key={t.id}>
              <CardTransactionRow
                transaction={t}
                isSelected={selectedIds.has(t.id)}
                onToggle={() => toggleRow(t.id)}
                groupCheckbox={
                  t.groupOwner
                    ? {
                        checked: Boolean(groupAllSelected),
                        indeterminate: Boolean(groupSomeSelected),
                        onToggle: () => toggleGroup(t.id),
                      }
                    : undefined
                }
                onOpen={onOpenTransaction}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export type { Transaction };
export { SAMPLE_TRANSACTIONS };


