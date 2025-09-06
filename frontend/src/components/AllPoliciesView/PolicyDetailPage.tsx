// src/components/AllPoliciesView/PolicyDetailPage.tsx

import React, { useState } from 'react';
import type { Policy, PolicyGroup as PolicyGroupType } from '../../types2';
import { PolicyEditForm } from './PolicyEditForm';

// --- Icon Components for the Header ---
const UndoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" />
  </svg>
);
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
}

export const PolicyDetailPage: React.FC<PolicyDetailPageProps> = ({ group, onGoBack, onUpdatePolicy, onAddPolicy }) => {
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);

  // ... (handleSave and handleCancel functions remain the same)
  const handleSave = (updatedPolicy: Policy) => {
    onUpdatePolicy(updatedPolicy);
    setEditingPolicyId(null);
  };

  const handleCancel = () => {
    setEditingPolicyId(null);
  };


  return (
    <div className="bg-white min-h-screen">
      {/* HEADER: Now full-width */}
      <header className="border-b border-gray-200">
        {/* THIS IS THE LINE THAT CHANGED: Removed max-w-4xl and mx-auto */}
        <div className="p-4 px-8 flex justify-between items-center">
          <button onClick={onGoBack} className="flex items-center text-gray-700 hover:text-black font-semibold">
            <span className="text-xl mr-2">←</span>
            Policy Intelligence
          </button>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-black"><UndoIcon /></button>
            <button onClick={onAddPolicy} className="text-sm font-bold text-brand-blue">
              Add Policy
            </button>
            <button className="bg-brand-blue text-white text-sm font-bold py-2 px-3 rounded-md hover:opacity-90">
              Publish
            </button>
            <button onClick={onGoBack} className="text-gray-500 hover:text-black"><CloseIcon /></button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT: Remains centered for readability */}
      <main className="max-w-4xl mx-auto py-16 px-8">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">{group.title}</h1>
          <p className="mt-4 text-md text-gray-500">Effective September 5, 2025</p>
        </div>

        {/* Policies List */}
        <div className="mt-20 space-y-12">
          {group.policies.map((policy) => (
            <div key={policy.id}>
              {editingPolicyId === policy.id ? (
                <PolicyEditForm initialPolicy={policy} onSave={handleSave} onCancel={handleCancel} />
              ) : (
                <div onClick={() => setEditingPolicyId(policy.id)} className="cursor-pointer">
                  <h2 className="text-3xl font-bold text-gray-900">{policy.title}</h2>
                  <p className="mt-4 text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {policy.description}
                  </p>
                  {policy.hiddenNotes && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm font-semibold text-gray-800">Hidden notes</p>
                      <p className="mt-2 text-gray-600">{policy.hiddenNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};