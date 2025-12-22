"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                               MAIN DIALOG                                  */
/* -------------------------------------------------------------------------- */

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onOpenChange) onOpenChange(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => onOpenChange?.(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-50 w-full max-w-lg rounded-lg bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* -------------------------------------------------------------------------- */
/*                               CONTENT WRAPPER                              */
/* -------------------------------------------------------------------------- */

export const DialogContent = ({
  children,
  className,
  ...props
}: DialogContentProps) => {
  return (
    <div className={cn("p-6 space-y-4", className)} {...props}>
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               HEADER / TITLE                               */
/* -------------------------------------------------------------------------- */

export const DialogHeader = ({ children, className }: DialogHeaderProps) => (
  <div
    className={cn("flex items-center justify-between border-b pb-3", className)}
  >
    {children}
  </div>
);

export const DialogTitle = ({ children, className }: DialogTitleProps) => (
  <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>
);

/* -------------------------------------------------------------------------- */
/*                                   FOOTER                                   */
/* -------------------------------------------------------------------------- */

export const DialogFooter = ({ children, className }: DialogFooterProps) => (
  <div className={cn("flex justify-end gap-2 pt-4 border-t mt-4", className)}>
    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/*                             CLOSE BUTTON (OPTIONAL)                        */
/* -------------------------------------------------------------------------- */

export const DialogCloseButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-3 right-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
  >
    <X className="h-5 w-5" />
  </button>
);
