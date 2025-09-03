// components/ui/Select.jsx - Enhanced Select with better keyboard navigation and accessibility
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "../../utils/cn";
import Button from "./Button";
import Input from "./Input";

const Select = React.forwardRef(({
    className,
    options = [],
    value,
    defaultValue,
    placeholder = "Select an option",
    multiple = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    searchable = false,
    clearable = false,
    loading = false,
    id,
    name,
    onChange,
    onOpenChange,
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const searchInputRef = useRef(null);

    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef?.current && 
                !dropdownRef?.current?.contains(event?.target) && 
                !buttonRef?.current?.contains(event?.target)) {
                setIsOpen(false);
                onOpenChange?.(false);
                setSearchTerm("");
                setFocusedIndex(-1);
            }
        };

        if (isOpen) {
            document?.addEventListener('mousedown', handleClickOutside);
            document?.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document?.removeEventListener('mousedown', handleClickOutside);
            document?.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen, onOpenChange]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isOpen) return;

            const filteredOptions = searchable && searchTerm
                ? options?.filter(option =>
                    option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    (option?.value && option?.value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
                )
                : options;

            switch (event?.key) {
                case 'Escape':
                    event?.preventDefault();
                    setIsOpen(false);
                    onOpenChange?.(false);
                    setSearchTerm("");
                    setFocusedIndex(-1);
                    buttonRef?.current?.focus();
                    break;
                case 'ArrowDown':
                    event?.preventDefault();
                    if (searchable && searchInputRef?.current === document?.activeElement) {
                        setFocusedIndex(0);
                    } else {
                        setFocusedIndex(prev => 
                            prev < filteredOptions?.length - 1 ? prev + 1 : prev
                        );
                    }
                    break;
                case 'ArrowUp':
                    event?.preventDefault();
                    setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
                    break;
                case 'Enter':
                    event?.preventDefault();
                    if (focusedIndex >= 0 && focusedIndex < filteredOptions?.length) {
                        handleOptionSelect(filteredOptions?.[focusedIndex]);
                    }
                    break;
                case 'Tab':
                    setIsOpen(false);
                    onOpenChange?.(false);
                    setSearchTerm("");
                    setFocusedIndex(-1);
                    break;
            }
        };

        if (isOpen) {
            document?.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document?.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, searchTerm, focusedIndex, options, onOpenChange]);

    // Filter options based on search
    const filteredOptions = searchable && searchTerm
        ? options?.filter(option =>
            option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            (option?.value && option?.value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
        )
        : options;

    // Get selected option(s) for display
    const getSelectedDisplay = () => {
        if (!value && !defaultValue) return placeholder;
        const displayValue = value || defaultValue;

        if (multiple) {
            const selectedOptions = options?.filter(opt => displayValue?.includes?.(opt?.value));
            if (!selectedOptions?.length) return placeholder;
            if (selectedOptions?.length === 1) return selectedOptions?.[0]?.label;
            return `${selectedOptions?.length} items selected`;
        }

        const selectedOption = options?.find(opt => opt?.value === displayValue);
        return selectedOption ? selectedOption?.label : placeholder;
    };

    const handleToggle = (event) => {
        event?.preventDefault();
        event?.stopPropagation();
        
        if (!disabled) {
            const newIsOpen = !isOpen;
            setIsOpen(newIsOpen);
            onOpenChange?.(newIsOpen);
            if (!newIsOpen) {
                setSearchTerm("");
                setFocusedIndex(-1);
            } else if (searchable) {
                // Focus search input when dropdown opens
                setTimeout(() => {
                    searchInputRef?.current?.focus();
                }, 100);
            }
        }
    };

    const handleOptionSelect = (option) => {
        if (option?.disabled) return;

        if (multiple) {
            const currentValue = value || [];
            const updatedValue = currentValue?.includes(option?.value)
                ? currentValue?.filter(v => v !== option?.value)
                : [...currentValue, option?.value];
            onChange?.(updatedValue);
        } else {
            onChange?.(option?.value);
            setIsOpen(false);
            onOpenChange?.(false);
            setSearchTerm("");
            setFocusedIndex(-1);
        }
    };

    const handleClear = (e) => {
        e?.stopPropagation();
        e?.preventDefault();
        onChange?.(multiple ? [] : '');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e?.target?.value);
        setFocusedIndex(-1); // Reset focus when searching
    };

    const isSelected = (optionValue) => {
        if (multiple) {
            return value?.includes?.(optionValue) || false;
        }
        return (value || defaultValue) === optionValue;
    };

    const hasValue = multiple ? (value?.length > 0) : (value !== undefined && value !== '' && value !== null);

    return (
        <div className={cn("relative", className)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block",
                        error ? "text-red-600" : "text-gray-900"
                    )}
                >
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <button
                    ref={(node) => {
                        buttonRef.current = node;
                        if (ref) {
                            if (typeof ref === 'function') {
                                ref(node);
                            } else {
                                ref.current = node;
                            }
                        }
                    }}
                    id={selectId}
                    type="button"
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                        error && "border-red-600 focus:ring-red-600",
                        !hasValue && "text-gray-400"
                    )}
                    onClick={handleToggle}
                    disabled={disabled || loading}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-describedby={error ? `${selectId}-error` : description ? `${selectId}-description` : undefined}
                    {...props}
                >
                    <span className="truncate">{getSelectedDisplay()}</span>

                    <div className="flex items-center gap-1">
                        {loading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}

                        {clearable && hasValue && !loading && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 hover:bg-gray-100"
                                onClick={handleClear}
                                tabIndex={-1}
                                aria-label="Clear selection"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}

                        <ChevronDown className={cn("h-4 w-4 transition-transform text-gray-500", isOpen && "rotate-180")} />
                    </div>
                </button>

                {/* Hidden native select for form submission */}
                <select
                    name={name}
                    value={value || ''}
                    onChange={() => { }} // Controlled by our custom logic
                    className="sr-only"
                    tabIndex={-1}
                    multiple={multiple}
                    required={required}
                    aria-hidden="true"
                >
                    <option value="">Select...</option>
                    {options?.map(option => (
                        <option key={option?.value} value={option?.value}>
                            {option?.label}
                        </option>
                    ))}
                </select>

                {/* Dropdown */}
                {isOpen && (
                    <div 
                        ref={dropdownRef}
                        className="absolute z-[9999] w-full mt-1 bg-white text-gray-900 border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden"
                        role="listbox"
                        aria-labelledby={selectId}
                    >
                        {searchable && (
                            <div className="p-2 border-b border-gray-100">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        ref={searchInputRef}
                                        placeholder="Search options..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-8 border-gray-200 focus:ring-indigo-600 focus:border-transparent"
                                        aria-label="Search options"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="py-1 max-h-48 overflow-y-auto">
                            {filteredOptions?.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    {searchTerm ? 'No options found' : 'No options available'}
                                </div>
                            ) : (
                                filteredOptions?.map((option, index) => (
                                    <div
                                        key={option?.value}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors",
                                            index === focusedIndex && "bg-indigo-50",
                                            isSelected(option?.value) && "bg-indigo-50 text-indigo-700 font-medium",
                                            option?.disabled && "pointer-events-none opacity-50",
                                            !option?.disabled && "hover:bg-gray-100 focus:bg-gray-100"
                                        )}
                                        onClick={(e) => {
                                            e?.stopPropagation();
                                            if (!option?.disabled) {
                                                handleOptionSelect(option);
                                            }
                                        }}
                                        role="option"
                                        aria-selected={isSelected(option?.value)}
                                        aria-disabled={option?.disabled}
                                    >
                                        <span className="flex-1">{option?.label}</span>
                                        {isSelected(option?.value) && (
                                            <Check className="h-4 w-4 text-indigo-600" />
                                        )}
                                        {option?.description && (
                                            <span className="text-xs text-gray-500 ml-2">
                                                {option?.description}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {description && !error && (
                <p id={`${selectId}-description`} className="text-sm text-gray-500 mt-1">
                    {description}
                </p>
            )}
            {error && (
                <p id={`${selectId}-error`} className="text-sm text-red-600 mt-1" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

Select.displayName = "Select";

export default Select;