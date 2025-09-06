import React from "react";

export default function AIPolicySuggestion() {
  return (
    <div className="border border-blue-200 bg-blue-50 text-blue-900 p-4">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M12 2l1.546 4.757H18.5l-3.773 2.741L16.273 15 12 12.259 7.727 15l1.546-5.502L5.5 6.757h4.954L12 2z"/></svg>
        </div>
        <div className="flex-1">
          <div className="font-semibold">AI Policy suggestions</div>
          <div className="mt-1 text-sm">
            Based on similar expenses, consider categorizing this as Client meals and applying your team policy limits for domestic travel. You can also prefill the memo and venue.
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Apply suggestions</button>
            <button className="px-3 py-1.5 border border-blue-300 text-blue-800 rounded hover:bg-blue-50 text-sm">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}


