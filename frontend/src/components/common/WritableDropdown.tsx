import React, { useState, useRef, useEffect } from "react";

interface WritableDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onAddOption?: (option: string) => void;
  placeholder?: string;
  className?: string;
}

export default function WritableDropdown({
  label,
  options,
  value,
  onChange,
  onAddOption,
  placeholder = "Select or type...",
  className = "",
}: WritableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    // Filter options based on input
    const filtered = options.filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleBlur();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, inputValue]);

  const handleBlur = () => {
    setIsOpen(false);
    // If input value doesn't match any option and is not empty, add it as new
    if (inputValue && !options.includes(inputValue)) {
      if (onAddOption) {
        onAddOption(inputValue);
      }
      onChange(inputValue);
    } else if (inputValue) {
      onChange(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const showAddNew = inputValue && !options.some(opt => 
    opt.toLowerCase() === inputValue.toLowerCase()
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          tabIndex={-1}
        >
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
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-60 overflow-auto">
          {showAddNew && (
            <div
              onClick={() => handleOptionClick(inputValue)}
              className="px-3 py-2 text-sm cursor-pointer bg-gray-50 text-gray-900 flex items-center justify-between border-b border-gray-200"
            >
              <span>Add "{inputValue}" as new person</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 text-gray-600"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          )}
          {filteredOptions.length === 0 && !showAddNew ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No matching options
            </div>
          ) : (
            <ul role="listbox">
              {filteredOptions.map((option, index) => (
                <li
                  key={`${option}-${index}`}
                  role="option"
                  aria-selected={option === value}
                  onClick={() => handleOptionClick(option)}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                    ${option === value
                      ? "bg-gray-50 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span>{option}</span>
                  {option === value && (
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
        </div>
      )}
    </div>
  );
}