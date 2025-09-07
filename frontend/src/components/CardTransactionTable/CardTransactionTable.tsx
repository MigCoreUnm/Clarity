import React from "react";
import CardTransactionRow from "./CardTransactionRow";
import type { Transaction } from "../../types2";

const SAMPLE_TRANSACTIONS: Transaction[] = [
  // Group: Kevin Malone - Office Party Supplies
  {
    id: "27",
    groupOwner: true,
    merchantInitials: "KM",
    merchantName: "Kevin Malone",
    merchantCategory: "",
    date: "Sep 5, 2025",
    amount: "$100.00 USD",
    policyStatus: "Out of policy",
    approvalStatus: "Pending",
    receiptThumbUrl: undefined,
    memo: "Office Party Supplies",
  },
  {
    id: "28",
    merchantInitials: "P",
    merchantName: "Publix",
    merchantCategory: "Groceries",
    date: "Sep 5, 2025",
    amount: "$100.00 USD",
    policyStatus: "Out of policy",
    approvalStatus: "Rejected",
    receiptThumbUrl: "/receipts/reciept1.jpg",
    memo: "Office Party Supplies",
  },

  // Group: Phyllis Vance - Client Lunch
  {
    id: "23",
    groupOwner: true,
    merchantInitials: "PV",
    merchantName: "Phyllis Vance",
    merchantCategory: "",
    date: "Apr 5, 2024",
    amount: "$45.00 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "Client Lunch",
  },
  {
    id: "24",
    merchantInitials: "JD",
    merchantName: "Joe's Diner",
    merchantCategory: "Restaurants",
    date: "Apr 5, 2024",
    amount: "$45.00 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: "/receipts/reciept3.png",
    memo: "Client Lunch",
  },

  // Group: Kelly Kapoor - Corporate Gifting
  {
    id: "25",
    groupOwner: true,
    merchantInitials: "KK",
    merchantName: "Kelly Kapoor",
    merchantCategory: "",
    date: "Sep 5, 2025",
    amount: "$95.29 USD",
    policyStatus: "Needs review",
    approvalStatus: "Pending",
    receiptThumbUrl: undefined,
    memo: "Corporate Gifting",
  },
  {
    id: "26",
    merchantInitials: "M",
    merchantName: "Marshalls",
    merchantCategory: "Department Store",
    date: "Sep 5, 2025",
    amount: "$95.29 USD",
    policyStatus: "Needs review",
    approvalStatus: "Pending",
    receiptThumbUrl: "/receipts/reciept4.jpeg",
    memo: "Corporate Gifting",
  },

  // Group: Angela Martin - Transport to Client
  {
    id: "29",
    groupOwner: true,
    merchantInitials: "AM",
    merchantName: "Angela Martin",
    merchantCategory: "",
    date: "Dec 4, 2015",
    amount: "$12.00 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "Transport to Client",
  },
  {
    id: "30",
    merchantInitials: "L",
    merchantName: "Lyft",
    merchantCategory: "Taxi and Rideshare",
    date: "Dec 4, 2015",
    amount: "$12.00 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: "/receipts/receipt 5.webp",
    memo: "Transport to Client",
  },

  // Group: Stanley Hudson - Business Travel
  {
    id: "31",
    groupOwner: true,
    merchantInitials: "SH",
    merchantName: "Stanley Hudson",
    merchantCategory: "",
    date: "Nov 20, 2019",
    amount: "$43.83 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "Business Travel",
  },
  {
    id: "32",
    merchantInitials: "U",
    merchantName: "Uber",
    merchantCategory: "Taxi and Rideshare",
    date: "Nov 20, 2019",
    amount: "$43.83 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: "/receipts/recipet6.png",
    memo: "Business Travel",
  },

  // Group: Creed Bratton - Team Lunch
  {
    id: "33",
    groupOwner: true,
    merchantInitials: "CB",
    merchantName: "Creed Bratton",
    merchantCategory: "",
    date: "Sep 5, 2025",
    amount: "$27.00 USD",
    policyStatus: "Needs review",
    approvalStatus: "Pending",
    receiptThumbUrl: undefined,
    memo: "Team Lunch",
  },
  {
    id: "34",
    merchantInitials: "FC",
    merchantName: "Flew the Coop",
    merchantCategory: "Food Delivery",
    date: "Sep 5, 2025",
    amount: "$27.00 USD",
    policyStatus: "Needs review",
    approvalStatus: "Pending",
    receiptThumbUrl: "/receipts/reciept7.jpeg",
    memo: "Team Lunch",
  },

  // Group: Mohammed Khan - Dubai Business Trip
  {
    id: "receipt-1-owner",
    groupOwner: true,
    merchantInitials: "MK",
    merchantName: "Mohammed Khan",
    merchantCategory: "",
    date: "Feb 17, 2011",
    amount: "$1,285.00 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "Dubai Business Trip - Q1 2011",
  },
  {
    id: "receipt-1",
    merchantInitials: "EM",
    merchantName: "Emirates Airlines",
    merchantCategory: "Airlines",
    date: "Feb 17, 2011",
    amount: "$1,285.00 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: "/receipts/receipt8.jpg",
    memo: "Round-trip Economy DXB-KHI for client meetings",
  },

  // Group: Star Flyer Team - Japan Office Setup
  {
    id: "receipt-2-owner",
    groupOwner: true,
    merchantInitials: "SF",
    merchantName: "Star Flyer Team",
    merchantCategory: "",
    date: "Jul 12, 2023",
    amount: "$27,610.00 USD",
    policyStatus: "Needs review",
    approvalStatus: "Pending",
    receiptThumbUrl: undefined,
    memo: "Japan Office Relocation Expenses",
  },
  {
    id: "receipt-2",
    merchantInitials: "SF",
    merchantName: "Star Flyer Inc",
    merchantCategory: "Airlines",
    date: "Jul 12, 2023",
    amount: "$27,610.00 USD",
    policyStatus: "Needs review",
    approvalStatus: "Pending",
    receiptThumbUrl: "/receipts/receipt9.jpg",
    memo: "Bulk airfare for 10 employees - Japan office setup (includes ¥810 consumption tax)",
  },

  // Group: Pamela Wong - Personal Entertainment
  {
    id: "receipt-3-owner",
    groupOwner: true,
    merchantInitials: "PW",
    merchantName: "Pamela Wong",
    merchantCategory: "",
    date: "Sep 11, 2014",
    amount: "$8.99 USD",
    policyStatus: "Out of policy",
    approvalStatus: "Rejected",
    receiptThumbUrl: undefined,
    memo: "Subscription Services",
  },
  {
    id: "receipt-3",
    merchantInitials: "NF",
    merchantName: "Netflix",
    merchantCategory: "Entertainment",
    date: "Sep 11, 2014",
    amount: "$8.99 USD",
    policyStatus: "Out of policy",
    approvalStatus: "Rejected",
    receiptThumbUrl: "/receipts/receipt10.jpg",
    memo: "Netflix subscription - Personal entertainment (non-reimbursable)",
  },

  // Group: Tech Equipment Purchase - Q4 2021
  {
    id: "receipt-4-owner",
    groupOwner: true,
    merchantInitials: "TT",
    merchantName: "Tech Team",
    merchantCategory: "",
    date: "Oct 6, 2021",
    amount: "$596.35 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: undefined,
    memo: "Mobile Device Procurement",
  },
  {
    id: "receipt-4",
    merchantInitials: "AP",
    merchantName: "Apple Store",
    merchantCategory: "Technology",
    date: "Oct 6, 2021",
    amount: "$596.35 USD",
    policyStatus: "In policy",
    approvalStatus: "Approved",
    receiptThumbUrl: "/receipts/receipt11.jpg",
    memo: "AirPods Max Space Gray - Remote work equipment (includes $47.35 tax)",
  },
];

export default function CardTransactionTable({
  onOpenTransaction,
  transactions = [],
  onDeleteGroup,
  onDeleteTransaction,
}: {
  onOpenTransaction?: (id: string) => void;
  transactions?: Transaction[];
  onDeleteGroup?: (groupId: string) => void;
  onDeleteTransaction?: (id: string) => void;
}) {
  // Responsive grid templates are defined in classNames for each breakpoint

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
    <div className="relative rounded-none border-y border-gray-200 overflow-x-auto">

      {/* Header */}
      <div
        className="grid items-center bg-gray-50 text-gray-600 text-xs tracking-wide px-6 py-3 min-w-fit
                   grid-cols-[minmax(50px,0.5fr)_minmax(150px,3fr)_minmax(100px,1.5fr)_minmax(120px,1.5fr)_15px]
                   md:grid-cols-[minmax(60px,0.5fr)_minmax(180px,2.5fr)_minmax(90px,1fr)_minmax(100px,1.2fr)_minmax(130px,1.3fr)_minmax(60px,0.5fr)_minmax(120px,1.5fr)_15px]
                   lg:grid-cols-[minmax(60px,0.5fr)_minmax(200px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(140px,1.2fr)_minmax(60px,0.5fr)_minmax(120px,1.5fr)_minmax(100px,1fr)_15px]"
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
        <div className="text-left px-3 hidden md:block">Date</div>
        <div className="text-right px-3">Amount</div>
        <div className="text-left px-3">Policy</div>
        <div className="text-center px-2 hidden md:block">Receipt</div>
        <div className="text-left px-3 hidden md:block">Memo</div>
        <div className="text-left px-3 hidden lg:block">Actions</div>
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
                onDeleteGroup={onDeleteGroup}
                onDeleteTransaction={onDeleteTransaction}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export type { Transaction } from "../../types2";
export { SAMPLE_TRANSACTIONS };


