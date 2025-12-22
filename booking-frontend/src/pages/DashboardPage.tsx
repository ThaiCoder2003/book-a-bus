import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import UserHeader from "@/components/helpers/UserHeader";

// Sidebar components
import UserProfile from "@/components/Dashboard/sidebar/UserProfile";
import QuickActions from "@/components/Dashboard/sidebar/QuickActions";
import FavoriteRoutes from "@/components/Dashboard/sidebar/FavoriteRoutes";
import SupportSection from "@/components/Dashboard/sidebar/SupportSection";

// Main content components
import StatsOverview from "@/components/Dashboard/StatsOverview";
import NextTripCard from "@/components/Dashboard/NextTripCard";
import VoucherSection from "@/components/Dashboard/VoucherSection";
import PaymentMethods from "@/components/Dashboard/PaymentMethods";
import BookingHistory from "@/components/Dashboard/BookingHistory";

export default function DashboardPage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUsername(decoded.name);
      } catch (error) {
        window.location.replace("/auth");
        toast.error("Can't get user information");
      }
    } else {
      toast.error("Can't get necessary token");
      window.location.replace("/auth");
    }
  }, []);

  return (
    <>
      <UserHeader />

      <div className="min-h-screen bg-muted/10 pb-10">
        <main className="container mx-auto px-4 py-10 max-w-8xl">
          {/* Main layout: Sidebar + Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar (Left) */}
            <aside className="lg:col-span-3 space-y-6">
              <UserProfile />
              <QuickActions />
              <FavoriteRoutes />
              <SupportSection />
            </aside>

            {/* Main Content (Right) */}
            <section className="lg:col-span-9 space-y-8">
              {/* Greeting + Stats grouped together */}

              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Xin chào, {username || "User"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Chúc bạn có một chuyến đi an toàn và vui vẻ.
                </p>
              </div>

              <StatsOverview />
              <NextTripCard />
              <VoucherSection />
              <PaymentMethods />
              <BookingHistory />
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
