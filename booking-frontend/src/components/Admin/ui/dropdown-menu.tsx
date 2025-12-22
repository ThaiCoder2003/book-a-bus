"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

// ---------------------- //
// Context setup
// ---------------------- //
interface DropdownMenuContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
  // Sửa từ HTMLDivElement thành HTMLDivElement | null
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null }, // Bây giờ TypeScript sẽ không báo lỗi ở đây nữa
});

// ---------------------- //
// Root component
// ---------------------- //
interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  // Khai báo kiểu tường minh cho useRef
  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

// ---------------------- //
// Trigger
// ---------------------- //
interface DropdownMenuTriggerProps {
  children: React.ReactNode;
}

export const DropdownMenuTrigger = ({ children }: DropdownMenuTriggerProps) => {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext);

  return (
    <div
      ref={triggerRef}
      data-dropdown-trigger
      onClick={() => setOpen(!open)}
      className="cursor-pointer select-none"
    >
      {children}
    </div>
  );
};

// ---------------------- //
// Content
// ---------------------- //
interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export const DropdownMenuContent = ({
  children,
  align = "end",
  className,
}: DropdownMenuContentProps) => {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 160; // chiều rộng menu (để căn lề)
      setPosition({
        top: rect.bottom + window.scrollY + 6,
        left:
          align === "end"
            ? rect.right + window.scrollX - menuWidth
            : align === "center"
            ? rect.left + window.scrollX - menuWidth / 2 + rect.width / 2
            : rect.left + window.scrollX,
      });
    }
  }, [open, align, triggerRef]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -5, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
          }}
          className={cn(
            "min-w-40 rounded-xl border border-gray-100 bg-white shadow-sm text-sm p-4 space-y-3 relative",
            className,
          )}
          onMouseLeave={() => setOpen(false)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

// ---------------------- //
// Item
// ---------------------- //
interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownMenuItem = ({
  children,
  onClick,
  className,
}: DropdownMenuItemProps) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  return (
    <div
      onClick={() => {
        setOpen(false);
        onClick?.();
      }}
      className={cn(
        "px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center rounded-sm transition-colors",
        className,
      )}
    >
      {children}
    </div>
  );
};
