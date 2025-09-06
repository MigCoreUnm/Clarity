// src/components/AllPoliciesView/AllPoliciesView.tsx

import React, { useState } from 'react';
import type { PolicyGroup as PolicyGroupType } from '../../types2';

// ... (EditIcon component remains the same)
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"/>
    </svg>
);

interface AllPoliciesViewProps {
    groups: PolicyGroupType[];
    onSelectGroup: (id:string) => void;
    onAddNewGroup: () => void;
    onUpdateGroupTitle: (groupId: string, newTitle: string) => void;
}

export const AllPoliciesView: React.FC<AllPoliciesViewProps> = ({ groups, onSelectGroup, onAddNewGroup, onUpdateGroupTitle }) => {
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState('');

    // ... (handler functions remain the same)
    const handleEditClick = (group: PolicyGroupType) => {
        setEditingGroupId(group.id);
        setCurrentTitle(group.title);
    };

    const handleSave = () => {
        if (editingGroupId) {
            onUpdateGroupTitle(editingGroupId, currentTitle);
        }
        setEditingGroupId(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') handleSave();
        else if (event.key === 'Escape') setEditingGroupId(null);
    };


    return (
        <div className="relative">
            <button
                onClick={() => alert('Navigate to home page...')}
                className="sticky top-6 left-6 z-10 bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-200 hover:text-black transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <main className="pt-16 pb-10 px-8">
                {/* This new container centers the content and controls its width */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">All Policy Groups</h2>
                        <button onClick={onAddNewGroup} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:opacity-90 whitespace-nowrap">
                            Add New Group
                        </button>
                    </div>

                    <div className="space-y-4">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="group bg-white flex justify-between items-center p-6 rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50"
                            >
                                {/* ... card content ... */}
                                {editingGroupId === group.id ? (
                                    <input
                                        type="text" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)}
                                        onBlur={handleSave} onKeyDown={handleKeyDown} autoFocus
                                        className="text-lg font-semibold bg-gray-100 p-1 rounded focus:outline-none w-full"
                                    />
                                ) : (
                                    <div onClick={() => onSelectGroup(group.id)} className="flex-grow cursor-pointer">
                                        <p className="text-lg font-semibold text-gray-800 transition-colors">
                                            {group.title}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{group.policies.length} policies</p>
                                    </div>
                                )}

                                {editingGroupId !== group.id && (
                                    <button onClick={() => handleEditClick(group)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                        <EditIcon />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};