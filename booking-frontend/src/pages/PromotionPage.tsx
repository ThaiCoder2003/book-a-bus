import React, { useState, useMemo } from "react";
import PromotionCard from "@/components/Promotion/PromotionCard";
import PromotionSearch from "@/components/Promotion/PromotionSearch";
import PromotionTabs from "@/components/Promotion/PromotionTabs";
import UserHeader from "@/components/helpers/UserHeader";
interface Promotion {
  id: number;
  code: string;
  title: string;
  description: string;
  discount: string;
  expireDate: string;
  minPrice: number;
  tag?: string;
  used: number;
  total: number;
}

const mockPromotions: Promotion[] = [
  {
    id: 1,
    code: "VEXERE50",
    title: "Giảm 50.000đ",
    description: "Giảm trực tiếp 50.000đ cho tất cả chuyến đi",
    discount: "50.000đ",
    expireDate: "2025-12-15",
    minPrice: 200000,
    tag: "HOT",
    used: 1523,
    total: 5000,
  },
  {
    id: 2,
    code: "DALAT30",
    title: "Giảm 30%",
    description: "Giảm 30% cho tuyến Sài Gòn - Đà Lạt",
    discount: "30%",
    expireDate: "2025-12-20",
    minPrice: 300000,
    tag: "TRENDING",
    used: 2341,
    total: 3000,
  },
  {
    id: 3,
    code: "FREESHIP",
    title: "Miễn phí vé",
    description: "Miễn phí tiền vé cho chuyến đi đầu tiên",
    discount: "Free",
    expireDate: "2025-12-31",
    minPrice: 0,
    tag: "NEW",
    used: 5678,
    total: 10000,
  },
];

const PromotionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "saved">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedCodes, setSavedCodes] = useState<string[]>([]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    if (!savedCodes.includes(code)) {
      setSavedCodes([...savedCodes, code]);
    }
  };

  const filteredPromotions = useMemo(() => {
    const now = new Date();
    return mockPromotions.filter((promo) => {
      const matchesSearch = promo.code
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "active"
          ? new Date(promo.expireDate) > now
          : savedCodes.includes(promo.code);

      return matchesSearch && matchesTab;
    });
  }, [activeTab, searchTerm, savedCodes]);

  return (
    <>
      <UserHeader />
      <div className="w-full max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Ưu đãi & Khuyến mãi</h1>

        <div className="mb-4">
          <PromotionSearch value={searchTerm} onChange={setSearchTerm} />
        </div>

        <PromotionTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {filteredPromotions.length === 0 ? (
          <div className="text-center mt-10 text-gray-500">
            Không tìm thấy khuyến mãi nào.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5 mt-6">
            {filteredPromotions.map((promo) => (
              <PromotionCard
                key={promo.id}
                promo={promo}
                onCopy={handleCopy}
                isSaved={savedCodes.includes(promo.code)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PromotionPage;
