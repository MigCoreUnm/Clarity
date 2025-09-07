// src/components/AllPoliciesView/AllPoliciesView.tsx

import React from 'react';
import type { PolicyGroup as PolicyGroupType } from '../../types2';

interface AllPoliciesViewProps {
    groups: PolicyGroupType[];
    onSelectGroup: (id:string) => void;
    onAddNewGroup: () => void;
    onUpdateGroupTitle: (groupId: string, newTitle: string) => void;
    onDeleteGroup: (groupId: string) => void;
    onBack: () => void;
}

export const AllPoliciesView: React.FC<AllPoliciesViewProps> = ({ groups, onSelectGroup, onAddNewGroup, onUpdateGroupTitle, onDeleteGroup, onBack }) => {


    return (
        <div className="relative min-h-screen bg-white text-gray-900">
            <button
                onClick={onBack}
                className="sticky top-6 left-6 z-10 bg-transparent p-0 rounded-none text-gray-700 hover:text-black"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <main className="pt-16 pb-10 px-8">
                {/* This new container centers the content and controls its width */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">All policies</h2>
                        <button onClick={onAddNewGroup} className="flex items-center gap-1 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                            Add group
                        </button>
                    </div>

                    <div className="relative rounded-none border-y border-gray-200 overflow-hidden divide-y divide-gray-200">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="group relative px-6 py-4 bg-white hover:bg-gray-50 cursor-pointer"
                                onClick={() => onSelectGroup(group.id)}
                            >
                                <div>
                                    <p className="text-base font-medium text-gray-900 transition-colors">
                                        {group.title}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-0.5">{group.policies.length} policies</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteGroup(group.id);
                                    }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600"
                                    aria-label="Delete group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};