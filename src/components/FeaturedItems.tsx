
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import HomeButton from "@/components/HomeButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop";
const MAX_FEATURED = 12;

const FeaturedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedItems();
    // Option: For real-time, subscribe to changes here
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("items")
        .select(
          `
          id,
          title,
          price,
          price_period,
          location,
          condition,
          images,
          ad_type,
          rating,
          user_id,
          category_id
        `
        )
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(MAX_FEATURED);

      if (error) {
        throw error;
      }
      const transformed =
        Array.isArray(data) && data.length > 0
          ? data.map((item) => ({
              ...item,
              images: Array.isArray(item.images)
                ? item.images.filter((img) => typeof img === "string")
                : typeof item.images === "string"
                ? [item.images]
                : [],
              rating: item.rating ? Number(item.rating) : 0,
            }))
          : [];
      setItems(transformed);
    } catch (error) {
      setError("Failed to load items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (p: number) => (p / 100).toLocaleString();
  const getImageUrl = (imgs) =>
    imgs && imgs.length ? imgs[0] : FALLBACK_IMG;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" text="Loading featured items..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={fetchFeaturedItems} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <HomeButton />
        </div>
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          No featured items available at the moment.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={fetchFeaturedItems} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <HomeButton />
        </div>
      </div>
    );
  }

  return (
    <Carousel
      opts={{ align: "start" }}
      className="w-full max-w-6xl mx-auto relative"
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-4/5 md:basis-1/2 lg:basis-1/3"
          >
            <Link to={`/item/${item.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={getImageUrl(item.images)}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMG;
                      }}
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
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        KES {formatPrice(item.price)}
                      </span>
                      <span className="text-sm text-gray-600">
                        /{item.price_period}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {item.condition}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FeaturedItems;
