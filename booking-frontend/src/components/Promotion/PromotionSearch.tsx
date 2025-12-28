import React from "react";

interface PromotionSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const PromotionSearch: React.FC<PromotionSearchProps> = ({
  value,
  onChange,
}) => {
  return (
    <input
      type="text"
      placeholder="Tìm mã giảm giá hoặc khuyến mãi..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default PromotionSearch;
