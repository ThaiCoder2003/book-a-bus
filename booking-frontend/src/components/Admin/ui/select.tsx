"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
  value?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

interface SelectContextProps {
  value?: string;
  onChange?: (val: string) => void;
}

const SelectContext = React.createContext<SelectContextProps>({});

/* -------------------------------------------------------------------------- */
/*                                  MAIN SELECT                               */
/* -------------------------------------------------------------------------- */

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  placeholder,
  children,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    value,
  );

  const handleChange = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{ value: internalValue, onChange: handleChange }}
    >
      <div className={cn("relative inline-block w-full", className)}>
        <SelectTrigger onClick={() => setOpen(!open)}>
          <SelectValue value={internalValue} placeholder={placeholder} />
        </SelectTrigger>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md"
            >
              <SelectContent>{children}</SelectContent>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SelectContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                TRIGGER & VALUE                             */
/* -------------------------------------------------------------------------- */

export const SelectTrigger: React.FC<
  SelectTriggerProps & { onClick?: () => void }
> = ({ children, className, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
        "hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className,
      )}
    >
      {children}
      <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
    </button>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({
  value,
  placeholder,
}) => {
  return (
    <span className={cn(value ? "text-gray-900" : "text-gray-400")}>
      {value || placeholder || "Chọn..."}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*                              CONTENT & ITEM                                */
/* -------------------------------------------------------------------------- */

export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className,
}) => {
  return <div className={cn("py-1", className)}>{children}</div>;
};

export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  children,
  className,
}) => {
  const { value: current, onChange } = React.useContext(SelectContext);
  const isSelected = current === value;

  return (
    <div
      onClick={() => onChange?.(value)}
      className={cn(
        "px-3 py-2 cursor-pointer select-none text-sm rounded-md",
        isSelected
          ? "bg-blue-50 text-blue-600 font-medium"
          : "hover:bg-gray-100 text-gray-800",
        className,
      )}
    >
      {children}
    </div>
  );
};
