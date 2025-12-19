import * as React from "react";
// Import ReactNode để chấp nhận các icon/component JSX
import { cn } from "../../../lib/utils";

// 1. ĐỊNH NGHĨA PROPS MỚI
export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  // Thêm thuộc tính icon (có thể là một ReactNode, tức là một icon Lucide hoặc JSX)
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      // 2. BỌC INPUT TRONG DIV RELATIVE ĐỂ ĐỊNH VỊ ICON
      <div className="relative">
        <input
          type={type}
          data-slot="input"
          ref={ref}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            // 3. THÊM PADDING BÊN TRÁI NẾU CÓ ICON
            icon ? "pl-10" : "pl-3",
            className,
          )}
          {...props}
        />

        {/* 4. HIỂN THỊ ICON VÀ CĂN CHỈNH */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
