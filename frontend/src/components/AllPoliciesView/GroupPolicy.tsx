// src/components/AllPoliciesView/GroupPolicy.tsx

import React, { useState } from 'react';
import type { PolicyGroup as PolicyGroupType, Policy as PolicyType } from '../../types2';
import { Policy } from './Policy';

interface GroupPolicyProps {
  group: PolicyGroupType;
  onUpdatePolicy: (groupId: string, policyId: string, updatedPolicy: Partial<PolicyType>) => void;
}

export const GroupPolicy: React.FC<GroupPolicyProps> = ({ group, onUpdatePolicy }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = (policyId: string, updatedPolicy: Partial<PolicyType>) => {
    onUpdatePolicy(group.id, policyId, updatedPolicy);
  };

  return (
    <div className="border-b border-gray-200 py-4">
      {/* Group Header - Click to expand/collapse */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-2xl font-bold text-gray-800">{group.title}</h2>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>
      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-4">
          {group.policies.map((policy) => (
            <Policy key={policy.id} policy={policy} onUpdatePolicy={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};