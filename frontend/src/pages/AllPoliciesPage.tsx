// src/pages/PoliciesPage.tsx

import React, { useState } from 'react';
import { AllPoliciesView } from '../components/AllPoliciesView/AllPoliciesView';
import { PolicyDetailPage } from '../components/AllPoliciesView/PolicyDetailPage';
import type { Policy, PolicyGroup as PolicyGroupType } from '../types2';

// Mock data to start with
const initialData: PolicyGroupType[] = [
  {
    id: 'group-1',
    title: 'Travel & Expenses (T&E) Policy',
    policies: [
      {
        id: 'policy-1a',
        title: 'Purpose',
        description: 'Business travel, client entertainment, and internal events fuel growth, but only if spending is disciplined.',
        hiddenNotes: 'Never apply the expense policy to the executive team unless the expense includes forbidden items.',
      },
      {
        id: 'policy-1b',
        title: 'Guiding Principles',
        description: '• Business necessity – spend only to achieve clear business outcomes.\n• Equity – rules apply to all levels unless explicitly stated.',
      },
    ],
  },
];

export const PoliciesPage: React.FC = () => {
  const [policyGroups, setPolicyGroups] = useState<PolicyGroupType[]>(initialData);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);



  const handleUpdateGroupTitle = (groupId: string, newTitle: string) => {
    setPolicyGroups(
      policyGroups.map((group) =>
        group.id === groupId ? { ...group, title: newTitle } : group
      )
    );
  };

  const handleSelectGroup = (id: string) => {
    setSelectedGroupId(id);
  };

  const handleGoBack = () => {
    setSelectedGroupId(null);
  };

  const handleAddNewGroup = () => {
    const newGroup: PolicyGroupType = {
      id: `group-${Date.now()}`,
      title: 'New Policy Group',
      policies: [],
    };
    setPolicyGroups([...policyGroups, newGroup]);
  };

  const handleAddPolicy = () => {
    if (!selectedGroupId) return;
    const newPolicy: Policy = {
      id: `policy-${Date.now()}`,
      title: 'New Policy Title',
      description: 'Add a description here.',
      hiddenNotes: '',
    };
    setPolicyGroups(
      policyGroups.map((g) =>
        g.id === selectedGroupId ? { ...g, policies: [...g.policies, newPolicy] } : g
      )
    );
  };

  const handleUpdatePolicy = (updatedPolicy: Policy) => {
    if (!selectedGroupId) return;
    setPolicyGroups(
      policyGroups.map((g) => {
        if (g.id === selectedGroupId) {
          return {
            ...g,
            policies: g.policies.map((p) => (p.id === updatedPolicy.id ? updatedPolicy : p)),
          };
        }
        return g;
      })
    );
  };

  const selectedGroup = policyGroups.find((group) => group.id === selectedGroupId);

  return (
    <div>
      {selectedGroup ? (
        <PolicyDetailPage
          group={selectedGroup}
          onGoBack={handleGoBack}
          onUpdatePolicy={handleUpdatePolicy}
          onAddPolicy={handleAddPolicy}
        />
      ) : (
        <AllPoliciesView
          groups={policyGroups}
          onSelectGroup={handleSelectGroup}
          onAddNewGroup={handleAddNewGroup}
          onUpdateGroupTitle={handleUpdateGroupTitle} 
        />
      )}
    </div>
  );
};