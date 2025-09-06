import CardTransactionView from "../components/CardTransactionView/CardTransactionView";

export default function CardTransactionDetailPage({
  transactionId,
  onBack,
}: {
  transactionId: string;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <CardTransactionView transactionId={transactionId} onBack={onBack} />
    </div>
  );
}

