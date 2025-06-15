
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

type SearchResultItemProps = {
  item: any;
  viewMode: "grid" | "list";
  formatPrice: (priceInCents: number) => string;
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop";

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, viewMode, formatPrice }) => (
  <Link key={item.id} to={`/item/${item.id}`}>
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={
              item.images && item.images.length > 0
                ? item.images[0]
                : FALLBACK_IMG
            }
            alt={item.title}
            className={`w-full object-cover rounded-t-lg group-hover:scale-105 transition-transform ${
              viewMode === "grid" ? "h-48" : "h-32 md:h-40"
            }`}
          />
          {item.ad_type !== "normal" && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
              Featured
            </Badge>
          )}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            ⭐ {item.rating || 0}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-green-600">
              KES {formatPrice(item.price)}
            </span>
            <span className="text-sm text-gray-600">/{item.price_period}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {item.location}
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-xs capitalize">
              {item.condition}
            </Badge>
            {item.profiles?.avatar_url && (
              <span className="flex items-center gap-1 ml-2">
                <img
                  src={item.profiles.avatar_url}
                  alt={item.profiles.full_name || "User"}
                  className="w-6 h-6 rounded-full object-cover border"
                />
                <span className="text-xs text-gray-500">
                  {item.profiles.full_name || "User"}
                </span>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default SearchResultItem;
