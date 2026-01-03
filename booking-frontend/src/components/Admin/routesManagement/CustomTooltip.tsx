// components/CustomTooltip.tsx

import { useState } from "react";
import type { ReactNode } from "react";

interface CustomTooltipProps {
  content: string; // Nội dung sẽ hiển thị (ví dụ: "Chỉnh sửa tuyến đường")
  children: ReactNode; // Phần tử được bọc (ví dụ: <button><Pencil /></button>)
}

export default function CustomTooltip({ content, children }: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center" 
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* 1. Phần tử được hover (Icon Button) */}
      {children}

      {/* 2. Tooltip Box (Chỉ hiện khi isVisible = true) */}
      {isVisible && (
        <div 
          className="absolute z-10 px-3 py-1 text-xs font-medium text-white bg-gray-700 rounded-lg shadow-sm whitespace-nowrap 
                     bottom-full left-1/2 transform -translate-x-1/2 mb-2"
        >
          {content}
          {/* Mũi tên nhỏ trỏ xuống tooltip */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div> 
        </div>
      )}
    </div>
  );
}