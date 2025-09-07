import React, { useState, useEffect } from "react";
import WritableDropdown from "../common/WritableDropdown";
import { api } from "../../services/api";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: NewTransaction) => void;
}

export interface NewTransaction {
  merchantName: string;
  merchantCategory: string;
  assignedTo: string;
  date: string;
  amount: string;
  receiptFile?: File;
  memo: string;
}

export default function NewTransactionModal({
  isOpen,
  onClose,
  onSave,
}: NewTransactionModalProps) {
  const [formData, setFormData] = useState<NewTransaction>({
    merchantName: "",
    merchantCategory: "",
    assignedTo: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    memo: "",
  });

  // Load people list from localStorage
  const [peopleList, setPeopleList] = useState<string[]>(() => {
    const saved = localStorage.getItem('clarityPeopleList');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with existing people from sample data
    return [
      "Kevin Malone",
      "Phyllis Vance",
      "Kelly Kapoor",
      "Angela Martin",
      "Stanley Hudson",
      "Creed Bratton"
    ];
  });

  // Predefined merchant categories
  const [categoryList, setCategoryList] = useState<string[]>(() => {
    const saved = localStorage.getItem('clarityCategoryList');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      "Groceries",
      "Restaurants",
      "Department Store",
      "Taxi and Rideshare",
      "Food Delivery",
      "Airlines",
      "Entertainment",
      "Technology",
      "Hotels",
      "Office Supplies",
      "Gas Station",
      "Healthcare",
      "Other"
    ];
  });

  // Save people list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clarityPeopleList', JSON.stringify(peopleList));
  }, [peopleList]);

  // Save category list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clarityCategoryList', JSON.stringify(categoryList));
  }, [categoryList]);

  const [errors, setErrors] = useState<Partial<Record<keyof NewTransaction, string>>>({});
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (field: keyof NewTransaction, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddPerson = (person: string) => {
    if (!peopleList.includes(person)) {
      setPeopleList(prev => [...prev, person]);
    }
  };

  const handleAddCategory = (category: string) => {
    if (!categoryList.includes(category)) {
      setCategoryList(prev => [...prev, category]);
    }
  };

  const processFile = async (file: File) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setFormData(prev => ({ ...prev, receiptFile: file }));
      
      // Parse the receipt to auto-populate fields
      setIsParsing(true);
      try {
        const parsed = await api.parseReceipt(file);
        console.log('Receipt parsing response:', parsed);
        
        if (parsed.error) {
          console.error('Receipt parsing error:', parsed.error);
          alert(`Failed to parse receipt: ${parsed.error}`);
        } else {
          // Handle category - check if it exists, if not add it
          let finalCategory = parsed.merchantCategory || "";
          if (finalCategory) {
            // Check if category exists (case-insensitive)
            const existingCategory = categoryList.find(cat => 
              cat.toLowerCase() === finalCategory.toLowerCase()
            );
            
            if (existingCategory) {
              // Use the existing category with correct casing
              finalCategory = existingCategory;
            } else {
              // Add new category to the list
              setCategoryList(prev => [...prev, finalCategory]);
            }
          }
          
          // Auto-populate fields with parsed data
          setFormData(prev => ({
            ...prev,
            merchantName: parsed.merchantName || prev.merchantName,
            merchantCategory: finalCategory,
            date: parsed.date || prev.date,
            amount: parsed.amount || prev.amount,
            memo: parsed.memo || prev.memo,
            receiptFile: file // Keep the file
          }));
          
          // Clear any existing errors for populated fields
          setErrors(prev => {
            const newErrors = { ...prev };
            if (parsed.merchantName) delete newErrors.merchantName;
            if (finalCategory) delete newErrors.merchantCategory;
            if (parsed.date) delete newErrors.date;
            if (parsed.amount) delete newErrors.amount;
            if (parsed.memo) delete newErrors.memo;
            return newErrors;
          });
          
          console.log('Form data updated with parsed receipt:', {
            merchantName: parsed.merchantName,
            merchantCategory: finalCategory,
            date: parsed.date,
            amount: parsed.amount,
            memo: parsed.memo
          });
        }
      } catch (error) {
        console.error('Failed to parse receipt:', error);
        alert('Failed to connect to the server. Please try again.');
      } finally {
        setIsParsing(false);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal
    const numericValue = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numericValue;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewTransaction, string>> = {};

    if (!formData.merchantName.trim()) {
      newErrors.merchantName = "Merchant name is required";
    }
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = "Person assignment is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (!formData.memo.trim()) {
      newErrors.memo = "Memo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Format amount with currency
      const formattedTransaction = {
        ...formData,
        amount: `$${parseFloat(formData.amount).toFixed(2)} USD`
      };
      onSave(formattedTransaction);
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      merchantName: "",
      merchantCategory: "",
      assignedTo: "",
      date: new Date().toISOString().split('T')[0],
      amount: "",
      memo: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">New Transaction</h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5 text-gray-500"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Receipt Upload - Moved to top */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Receipt
            </label>
            <div 
              className="relative"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="receipt-upload"
                disabled={isParsing}
              />
              <label
                htmlFor="receipt-upload"
                className={`flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
                  isDragging
                    ? 'border-blue-400 bg-blue-50'
                    : isParsing 
                    ? 'border-blue-300 bg-blue-50 cursor-wait' 
                    : formData.receiptFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {isParsing ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-8 w-8 text-blue-600 animate-spin"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    <span className="text-sm text-blue-700">Parsing receipt...</span>
                    <span className="text-xs text-blue-600">AI is reading your receipt</span>
                  </div>
                ) : formData.receiptFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-8 w-8 text-green-600"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">{formData.receiptFile.name}</span>
                    <span className="text-xs text-gray-500">Click or drop another file to replace</span>
                  </div>
                ) : isDragging ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-8 w-8 text-blue-500"
                    >
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 10l3-3m0 0l3 3m-3-3v12" />
                    </svg>
                    <span className="text-sm text-blue-600 font-medium">Drop receipt here</span>
                    <span className="text-xs text-blue-500">Release to upload</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-8 w-8 text-gray-400"
                    >
                      <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-600 font-medium">Click to upload or drag & drop</span>
                    <span className="text-xs text-gray-500">PNG, JPG, or PDF up to 10MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Merchant Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Merchant Name
            </label>
            <input
              type="text"
              value={formData.merchantName}
              onChange={(e) => handleInputChange("merchantName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.merchantName ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Enter merchant name"
            />
            {errors.merchantName && (
              <p className="mt-1 text-xs text-red-500">{errors.merchantName}</p>
            )}
          </div>

          {/* Merchant Category */}
          <div>
            <WritableDropdown
              label="Category"
              options={categoryList}
              value={formData.merchantCategory}
              onChange={(value) => handleInputChange("merchantCategory", value)}
              onAddOption={handleAddCategory}
              placeholder="Select or type category"
              className="w-full"
            />
            {errors.merchantCategory && (
              <p className="mt-1 text-xs text-red-500">{errors.merchantCategory}</p>
            )}
          </div>

          {/* Assigned To */}
          <div>
            <WritableDropdown
              label="Assign to Person"
              options={peopleList}
              value={formData.assignedTo}
              onChange={(value) => handleInputChange("assignedTo", value)}
              onAddOption={handleAddPerson}
              placeholder="Select or type person name"
              className="w-full"
            />
            {errors.assignedTo && (
              <p className="mt-1 text-xs text-red-500">{errors.assignedTo}</p>
            )}
          </div>

          {/* Date and Amount Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.date ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", formatAmount(e.target.value))}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    errors.amount ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Memo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Memo
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => handleInputChange("memo", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none ${
                errors.memo ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Add notes about this transaction..."
            />
            {errors.memo && (
              <p className="mt-1 text-xs text-red-500">{errors.memo}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}