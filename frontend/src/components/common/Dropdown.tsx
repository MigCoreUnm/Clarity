import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
  placeholder?: string;
  className?: string;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  multiSelect = false,
  placeholder = "Select...",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (multiSelect && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(o => o.value === value[0]);
        return option?.label || placeholder;
      }
      return `${value.length} selected`;
    } else if (!multiSelect && typeof value === "string") {
      const option = options.find(o => o.value === value);
      return option?.label || placeholder;
    }
    return placeholder;
  };

  const isSelected = (optionValue: string) => {
    if (multiSelect && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  const hasValue = () => {
    if (multiSelect && Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "" && value !== undefined;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          flex items-center gap-2 rounded-full px-3 py-1 text-sm border transition-all
          ${hasValue() 
            ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-50" 
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-gray-900 font-medium">{label}</span>
        <span className={`${hasValue() ? "text-gray-600" : "text-gray-400"}`}>
          {getDisplayValue()}
        </span>
        {hasValue() && !isOpen && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(multiSelect ? [] : "");
            }}
            className="ml-auto -mr-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Clear selection"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3 w-3 text-gray-500"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        {(!hasValue() || isOpen) && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
          ) : (
            <ul role="listbox" className="max-h-60 overflow-auto">
              {options.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected(option.value)}
                  onClick={() => handleOptionClick(option.value)}
                  className={`
                    px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                    ${isSelected(option.value) 
                      ? "bg-gray-50 text-gray-900" 
                      : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {isSelected(option.value) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4 text-gray-600"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          )}
          {multiSelect && hasValue() && (
            <div className="border-t border-gray-200 px-3 py-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}