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
    <div className="ml-8 my-4 p-4 border-l-2 border-gray-200">
      {/* Editable Title */}
      <input
        type="text"
        defaultValue={policy.title}
        onBlur={(e) => handleBlur('title', e.target.value)}
        className="text-lg font-semibold bg-transparent w-full focus:outline-none focus:bg-gray-100 rounded p-1"
      />
      {/* Editable Description */}
      <textarea
        defaultValue={policy.description}
        onBlur={(e) => handleBlur('description', e.target.value)}
        className="mt-2 text-gray-700 bg-transparent w-full focus:outline-none focus:bg-gray-100 rounded p-1 h-24"
      />
      {/* Editable Hidden Notes */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm font-medium text-gray-600">Hidden notes</p>
        <textarea
          defaultValue={policy.hiddenNotes}
          onBlur={(e) => handleBlur('hiddenNotes', e.target.value)}
          className="mt-1 text-sm text-gray-500 bg-transparent w-full focus:outline-none focus:bg-gray-100 rounded p-1 h-16"
          placeholder="Add internal notes here..."
        />
      </div>
    </div>
  );
};