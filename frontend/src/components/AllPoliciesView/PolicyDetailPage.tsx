// src/components/AllPoliciesView/PolicyDetailPage.tsx

import React, { useState } from 'react';
import type { Policy, PolicyGroup as PolicyGroupType } from '../../types2';
import { PolicyEditForm } from './PolicyEditForm';

// --- Icon Components for the Header ---
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Main Component ---
interface PolicyDetailPageProps {
  group: PolicyGroupType;
  onGoBack: () => void;
  onUpdatePolicy: (policy: Policy) => void;
  onAddPolicy: () => void;
  onDeletePolicy: (policyId: string) => void;
}

export const PolicyDetailPage: React.FC<PolicyDetailPageProps> = ({ group, onGoBack, onUpdatePolicy, onAddPolicy, onDeletePolicy }) => {
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);

  // ... (handleSave and handleCancel functions remain the same)
  const handleSave = (updatedPolicy: Policy) => {
    onUpdatePolicy(updatedPolicy);
    setEditingPolicyId(null);
  };

  const handleCancel = () => {
    setEditingPolicyId(null);
  };

  const handleDelete = (policyId: string) => {
    onDeletePolicy(policyId);
    setEditingPolicyId(null);
  };


  return (
    <div className="bg-white min-h-screen text-gray-900">
      <header className="px-8 py-2 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-900">Policy Intelligence</div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 bg-gray-200 text-gray-800 px-3 py-1.5 text-sm hover:opacity-90">
              Publish
            </button>
            <button onClick={onGoBack} className="h-9 w-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200" aria-label="Close" title="Close">
              <CloseIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-8">
        <div className="text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{group.title}</h1>
          <p className="mt-2 text-sm text-gray-500">Effective September 5, 2025</p>
        </div>

        <div className="mt-8 space-y-8">
          {group.policies.map((policy) => (
            <div key={policy.id}>
              {editingPolicyId === policy.id ? (
                <PolicyEditForm initialPolicy={policy} onSave={handleSave} onCancel={handleCancel} onDelete={handleDelete} />
              ) : (
                <div onClick={() => setEditingPolicyId(policy.id)} className="cursor-pointer rounded-lg border border-transparent px-4 py-3 hover:bg-gray-50 hover:border-gray-300 hover:ring-2 hover:ring-gray-400 transition-colors">
                  <h2 className="text-xl font-medium text-gray-900">{policy.title}</h2>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {policy.description}
                  </p>
                  {policy.hiddenNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-xs font-medium text-gray-700">Hidden notes</p>
                      <p className="mt-1 text-sm text-gray-600">{policy.hiddenNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="border-t border-gray-200">
            <div
              onClick={onAddPolicy}
              className="cursor-pointer py-4 text-sm text-gray-700 hover:text-gray-900"
              title="Add a new policy"
            >
              Add a new policy
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};