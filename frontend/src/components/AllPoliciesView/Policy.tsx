// src/components/AllPoliciesView/Policy.tsx

import React from 'react';
import type { Policy as PolicyType } from '../../types2';

interface PolicyProps {
  policy: PolicyType;
  onUpdatePolicy: (id: string, updatedPolicy: Partial<PolicyType>) => void;
}

export const Policy: React.FC<PolicyProps> = ({ policy, onUpdatePolicy }) => {
  const handleBlur = (field: keyof PolicyType, value: string) => {
    onUpdatePolicy(policy.id, { [field]: value });
  };

  return (
    <div className="px-6 py-4">
      {/* Editable Title */}
      <input
        type="text"
        defaultValue={policy.title}
        onBlur={(e) => handleBlur('title', e.target.value)}
        className="text-base font-medium text-blackbg-transparent w-full focus:outline-none rounded p-1"
      />
      {/* Editable Description */}
      <textarea
        defaultValue={policy.description}
        onBlur={(e) => handleBlur('description', e.target.value)}
        className="mt-1 text-sm text-black bg-transparent w-full focus:outline-none rounded p-1 h-24"
      />
      {/* Editable Hidden Notes */}
      <div className="mt-3 p-3 bg-gray-50 rounded-md">
        <p className="text-xs font-medium text-gray-700">Hidden notes</p>
        <textarea
          defaultValue={policy.hiddenNotes}
          onBlur={(e) => handleBlur('hiddenNotes', e.target.value)}
          className="mt-1 text-sm text-gray-600 bg-transparent w-full focus:outline-none rounded p-1 h-16"
          placeholder="Add internal notes here..."
        />
      </div>
    </div>
  );
};