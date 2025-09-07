// src/components/AllPoliciesView/PolicyEditForm.tsx

import React, { useState } from 'react';
import { EyeOff } from 'lucide-react';
import type { Policy } from '../../types2';

interface PolicyEditFormProps {
  // Pass the initial policy data, can be empty for a new policy
  initialPolicy: Policy;
  onSave: (updatedPolicy: Policy) => void;
  onCancel: () => void;
  onDelete: (policyId: string) => void;
}

export const PolicyEditForm: React.FC<PolicyEditFormProps> = ({ initialPolicy, onSave, onCancel, onDelete }) => {
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
    <div className="border border-gray-200 p-6 bg-white my-6">
      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-black">
            Title <span className="text-black">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm text-gray-900"
          />
        </div>
        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-black">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1 block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm text-gray-900 resize-none"
            placeholder="• Bullet points can be used here"
          />
        </div>
        {/* Hidden Notes Field */}
        <div>
          <label htmlFor="hiddenNotes" className="flex items-center gap-2 text-sm font-semibold text-black">
            <EyeOff className="h-4 w-4" />
            <span className="text-base">Hidden notes</span>
          </label>
          <textarea
            id="hiddenNotes"
            value={hiddenNotes}
            onChange={(e) => setHiddenNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-400 sm:text-sm text-gray-900 resize-none"
            placeholder="Add internal notes here..."
          />
          <p className="mt-2 text-xs text-gray-500">Notes are not visible to employees</p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <button 
          onClick={onCancel}
          className="text-gray-600 py-2 px-4 underline"
        >
          Cancel
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(initialPolicy.id)}
            className="text-red-600 border border-red-200 py-2 px-4 rounded hover:bg-red-50"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="bg-[#ecf66b] text-gray-600 py-2 px-4 hover:bg-[#d4dd60] ml-2"
          >
            Save as draft
          </button>
        </div>
      </div>
    </div>
  );
};