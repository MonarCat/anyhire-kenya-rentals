
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Eye, Heart } from "lucide-react";

interface FeaturedItemCardProps {
  item: any;
  formatPrice: (priceInCents: number) => string;
  getImageUrl: (images: any) => string;
}

const FeaturedItemCard: React.FC<FeaturedItemCardProps> = ({ item, formatPrice, getImageUrl }) => {
  return (
    <Link to={`/item/${item.id}`} className="group">
      <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer h-full overflow-hidden border-0 bg-white hover:-translate-y-1 active:scale-95">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={getImageUrl(item.images)}
              alt={item.title}
              className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop";
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Featured Badge */}
            {item.ad_type !== "normal" && (
              <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg animate-pulse text-xs">
                ⭐ Featured
              </Badge>
            )}
            
            {/* Rating */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              {item.rating || 4.5}
            </div>

            {/* Heart Icon - Hidden on mobile for touch optimization */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 cursor-pointer hidden sm:block">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-red-500 transition-colors" />
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2 text-gray-800 group-hover:text-emerald-600 transition-colors">
              {item.title}
            </h3>
            
            <div className="flex items-baseline justify-between mb-2 sm:mb-3">
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  KES {formatPrice(item.price)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  /{item.price_period}
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 group-hover:text-gray-700 transition-colors">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-emerald-500 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            
            <div className="flex justify-between items-center mb-3 sm:mb-0">
              <Badge 
                variant="secondary" 
                className="text-xs capitalize bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border-0"
              >
                {item.condition}
              </Badge>
              
              {item.profiles?.avatar_url && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <img 
                    src={item.profiles.avatar_url}
                    alt={item.profiles.full_name || 'User'}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-emerald-100 group-hover:border-emerald-200 transition-colors"
                  />
                  <span className="text-xs text-gray-600 font-medium truncate max-w-16 sm:max-w-20">
                    {item.profiles.full_name || 'User'}
                  </span>
                </div>
              )}
            </div>

            {/* View count indicator - Hidden on small screens to save space */}
            <div className="hidden sm:flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="w-3 h-3" />
                <span>{item.view_count || 0} views</span>
              </div>
              <div className="text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Details →
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeaturedItemCard;
