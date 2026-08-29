import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  label?: string;
  labelClassName?: string;
  options: (SelectOption | string | number)[];
  value?: string | number;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  required?: boolean;
}

export function Select({
  label,
  labelClassName = "",
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  disabled = false,
  size = "md",
  required = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isRequired =
    required || (typeof label === "string" && label.includes("*"));
  const cleanLabel =
    typeof label === "string" ? label.replace(/\s*\*/g, "").trim() : label;

  // Safely normalize options array into SelectOption format
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (
        typeof opt === "object" &&
        opt !== null &&
        "value" in opt &&
        "label" in opt
      ) {
        return opt as SelectOption;
      }
      return { label: String(opt), value: opt as string | number };
    });
  }, [options]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-9 px-3 text-xs",
    lg: "h-10 px-3.5 text-sm",
  };

  return (
    <div
      className={`relative inline-block text-left w-full ${className}`}
      ref={dropdownRef}
    >
      {/* Optional Label / Title */}
      {label && (
        <label
          className={`block text-xs font-medium text-slate-700 mb-1.5 ${labelClassName}`}
        >
          {cleanLabel}
          {isRequired && (
            <span className="text-rose-500 font-bold ml-0.5">*</span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-0 focus-visible:outline-none cursor-pointer transition-all inline-flex items-center justify-between gap-2 shadow-2xs ${
          sizeClasses[size]
        } ${
          isOpen
            ? "border-[#ff6600]"
            : "border-slate-300 hover:border-[#ff6600]"
        } ${disabled ? "opacity-50 pointer-events-none" : ""} ${buttonClassName}`}
      >
        <span className="truncate">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#ff6600]" : ""
          }`}
        />
      </button>

      {/* Floating Options Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 mt-1 z-50 w-full min-w-[120px] bg-white rounded-xl shadow-xl border border-slate-200 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto ${menuClassName}`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange?.(String(opt.value));
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-slate-100 text-[#ff6600] font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-[#ff6600] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Select;
