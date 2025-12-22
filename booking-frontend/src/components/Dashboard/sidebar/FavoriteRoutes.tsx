import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function FavoriteRoutes() {
  const routes = [
    { from: "Sài Gòn", to: "Đà Lạt", trips: 12 },
    { from: "Hà Nội", to: "Hải Phòng", trips: 8 },
    { from: "Sài Gòn", to: "Vũng Tàu", trips: 16 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Tuyến yêu thích
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {routes.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer bg-white hover:bg-[#EAF4FF] hover:text-[#0064D2] hover:border-[#C2DFFF] transition-colors  active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">
                {r.from} → {r.to}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {r.trips} chuyến đi
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
