import React from "react";

export default function AIPolicyMatcher({
  amount,
  memo,
}: {
  amount: string;
  memo: string;
}) {
  return (
    <div className="border border-green-200 bg-green-50 text-green-800 p-4">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M5 13l4 4L19 7"/></svg>
        </div>
        <div className="flex-1">
          <div className="font-semibold">Approval recommended</div>
          <ul className="mt-2 text-sm space-y-1">
            <li>
              The client lunch for 6 attendees cost {amount}, comfortably under the $900 domestic limit set by the $150-per-person domestic cap
              <span className="inline-block align-middle ml-1 text-xs">ⓘ</span>
            </li>
            <li>Receipt has been <button className="underline underline-offset-2">auto-verified</button></li>
            {memo && <li>Memo indicates: {memo}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}


