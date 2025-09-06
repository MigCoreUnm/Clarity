// src/components/AllPoliciesView/PolicyEditForm.tsx

import React, { useState } from 'react';
import type { Policy } from '../../types2';

interface PolicyEditFormProps {
  // Pass the initial policy data, can be empty for a new policy
  initialPolicy: Policy;
  onSave: (updatedPolicy: Policy) => void;
  onCancel: () => void;
}

export const PolicyEditForm: React.FC<PolicyEditFormProps> = ({ initialPolicy, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialPolicy.title);
  const [description, setDescription] = useState(initialPolicy.description);
  const [hiddenNotes, setHiddenNotes] = useState(initialPolicy.hiddenNotes || '');

  const handleSave = () => {
    onSave({
      ...initialPolicy,
      title,
      description,
      hiddenNotes,
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white my-6">
      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
          />
        </div>
        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
            placeholder="• Bullet points can be used here"
          />
        </div>
        {/* Hidden Notes Field */}
        <div className="bg-gray-50 p-4 rounded-md">
          <label htmlFor="hiddenNotes" className="block text-sm font-medium text-gray-700">
            Hidden notes
          </label>
          <textarea
            id="hiddenNotes"
            value={hiddenNotes}
            onChange={(e) => setHiddenNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
          />
          <p className="mt-2 text-xs text-gray-500">Notes are not visible to employees</p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end items-center mt-6 pt-4 border-t">
        <button
          onClick={onCancel}
          className="text-gray-600 font-bold py-2 px-4 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-yellow-400 text-yellow-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 ml-2"
        >
          Save as draft
        </button>
      </div>
    </div>
  );
};