import React from "react";

interface BottomBarProps {
  currentCount: number;
  totalCount: number;
  totalAmount: string;
}

export default function BottomBar({
  currentCount,
  totalCount,
  totalAmount,
}: BottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="text-sm text-gray-600">
          {currentCount}–{totalCount} of {totalCount} matching transactions
        </div>
        <div className="text-sm font-medium text-gray-600">{totalAmount}</div>
      </div>
    </div>
  );
}