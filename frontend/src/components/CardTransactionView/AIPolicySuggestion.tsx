import { useState, useEffect } from "react";
import type { Transaction } from "../../types2";
import { api } from "../../services/api";

// Function to parse content and extract sources
const parseContentAndSources = (content: string) => {
  // Split by "Sources:" or "Source:" (case-insensitive), regardless of line breaks
  const parts = content.split(/\bSources?:\s*/i);
  const mainContent = parts[0].trim();
  const sourcesText = parts[1] || '';
  
  // Extract URLs from sources text
  // Handle both comma-separated and newline-separated URLs
  const urlRegex = /https?:\/\/[^\s,]+/g;
  const urls = sourcesText.match(urlRegex) || [];
  
  return { mainContent, sources: urls };
};

// Component for individual source links
const SourceLink = ({ url, index }: { url: string; index: number }) => {
  // Extract domain name for display
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return `Source ${index + 1}`;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-1 text-xs 
                 bg-white border border-gray-200 
                 hover:bg-gray-50 
                 transition-colors duration-200"
    >
      <span className="text-gray-700">{getDomain(url)}</span>
      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
};

export default function AIPolicySuggestion({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [toolhouseSuggestion, setToolhouseSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [parsedContent, setParsedContent] = useState<string>('');
  const [sources, setSources] = useState<string[]>([]);
  
  // Fetch Toolhouse policy suggestions when component mounts or transaction changes
  useEffect(() => {
    const fetchPolicySuggestion = async () => {
      // Check if transaction already has cached suggestion
      if (transaction.policySuggestion?.content) {
        setToolhouseSuggestion(transaction.policySuggestion.content);
        
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the new cached endpoint
        const response = await api.getTransactionPolicySuggestion(transaction.id, false);
        if (response.suggestion) {
          setToolhouseSuggestion(response.suggestion);
          
        } else {
          setError("No policy suggestion available");
        }
      } catch (err) {
        console.error('Failed to fetch policy suggestion:', err);
        setError("Failed to load policy suggestions");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPolicySuggestion();
  }, [transaction.id]); // Re-fetch when transaction changes
  
  // Parse content and sources when toolhouseSuggestion changes
  useEffect(() => {
    if (toolhouseSuggestion) {
      const { mainContent, sources } = parseContentAndSources(toolhouseSuggestion);
      setParsedContent(mainContent);
      setSources(sources);
    } else {
      setParsedContent('');
      setSources([]);
    }
  }, [toolhouseSuggestion]);
  
  const suggestionText = (() => {
    // If we have parsed content, show that (without sources)
    if (parsedContent) {
      return parsedContent;
    }
    
    // If we have a Toolhouse suggestion but no parsed content yet, show original
    if (toolhouseSuggestion) {
      return toolhouseSuggestion;
    }
    
    // If there's an error, show it
    if (error) {
      return error;
    }
    
    // If loading, show loading state
    if (isLoading) {
      return "Analyzing policy implications...";
    }
    
    // Fallback to basic suggestions based on category
    const merchant = transaction.merchantName;
    const category = transaction.merchantCategory || "General";
    const amount = transaction.amount;
    
    if (category.toLowerCase().includes("restaurant") || category.toLowerCase().includes("food") || category.toLowerCase().includes("diner")) {
      return `Based on similar expenses at ${merchant}, consider categorizing this as Meals & Entertainment and apply your per-person limits. Amount is ${amount}.`;
    }
    if (category.toLowerCase().includes("taxi") || category.toLowerCase().includes("rideshare") || merchant.toLowerCase().includes("uber") || merchant.toLowerCase().includes("lyft")) {
      return `Looks like ground transportation. Tag as Ground Transport and ensure trip purpose is filled. Amount is ${amount}.`;
    }
    if (category.toLowerCase().includes("hotel") || category.toLowerCase().includes("lodging")) {
      return `Likely Lodging. Apply nightly rate policy and attach folio if available. Amount is ${amount}.`;
    }
    if (category.toLowerCase().includes("airline")) {
      return `Airfare detected. Verify class-of-service policy and trip approval reference. Amount is ${amount}.`;
    }
    return `Consider applying your standard policy for ${category}. Prefill memo with merchant: ${merchant}. Amount is ${amount}.`;
  })();

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Force refresh to get new suggestion from Toolhouse
      const response = await api.getTransactionPolicySuggestion(transaction.id, true);
      if (response.suggestion) {
        setToolhouseSuggestion(response.suggestion);
        
      } else {
        setError("No policy suggestion available");
      }
    } catch (err) {
      console.error('Failed to fetch policy suggestion:', err);
      setError("Failed to load policy suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine styling based on approval status
  const isRejected = transaction.approvalStatus === "Rejected";
  const borderColor = isRejected ? "border-red-200" : "border-blue-200";
  const bgColor = isRejected ? "bg-red-50" : "bg-blue-50";
  const textColor = isRejected ? "text-red-900" : "text-blue-900";
  const iconBgColor = isRejected ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";
  
  // Timestamp available via `timestamp` if needed for future UI
  
  return (
    <div className={`border ${borderColor} ${bgColor} ${textColor} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`h-8 w-8 rounded-full ${iconBgColor} flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M12 2l1.546 4.757H18.5l-3.773 2.741L16.273 15 12 12.259 7.727 15l1.546-5.502L5.5 6.757h4.954L12 2z"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-semibold flex items-center gap-2">
            <span>AI Policy Analysis</span>
            {toolhouseSuggestion && (
              <span className="text-xs font-normal text-gray-600">(Powered by Toolhouse & Exa)</span>
            )}
          </div>
          <div className="mt-1 text-sm whitespace-pre-wrap">
            {suggestionText}
          </div>
          {/* Source links section */}
          {sources.length > 0 && !isLoading && (
            <div className="mt-3 flex flex-wrap gap-2">
              {sources.map((url, index) => (
                <SourceLink key={index} url={url} index={index} />
              ))}
            </div>
          )}
          {!isLoading && toolhouseSuggestion && error && (
            <div className="mt-3">
              <span className="text-xs text-red-600">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}