import CardTransactionView from "../components/CardTransactionView/CardTransactionView";
import type { Transaction } from "../types2";

export default function CardTransactionDetailPage({
  transactionId,
  transactions,
  onBack,
}: {
  transactionId: string;
  transactions: Transaction[];
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <CardTransactionView transactionId={transactionId} transactions={transactions} onBack={onBack} />
    </div>
  );
}

