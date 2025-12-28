import React from "react";

interface PromotionTabsProps {
  activeTab: "all" | "active" | "saved";
  onTabChange: (tab: "all" | "active" | "saved") => void;
}

const PromotionTabs: React.FC<PromotionTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "active", label: "Đang hoạt động" },
    { key: "saved", label: "Đã lưu" },
  ] as const;

  return (
    <div className="flex gap-3 border-b border-gray-200 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-2 font-medium border-b-2 transition-all ${
            activeTab === tab.key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PromotionTabs;
