
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import HomeButton from "@/components/HomeButton";
import FeaturedItemCard from "@/components/featured/FeaturedItemCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop";
const MAX_FEATURED = 12;

const FeaturedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get featured items
      let { data, error } = await supabase
        .from("items")
        .select(`
          id,
          title,
          price,
          price_period,
          location,
          condition,
          images,
          ad_type,
          is_featured,
          created_at,
          rating,
          user_id,
          category_id,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq("is_featured", true)
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(MAX_FEATURED);

      // If no featured items, get recent items instead
      if (!error && (!data || data.length === 0)) {
        const { data: recentData, error: recentError } = await supabase
          .from("items")
          .select(`
            id,
            title,
            price,
            price_period,
            location,
            condition,
            images,
            ad_type,
            is_featured,
            created_at,
            rating,
            user_id,
            category_id,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .eq("is_available", true)
          .order("created_at", { ascending: false })
          .limit(MAX_FEATURED);
        
        data = recentData;
        error = recentError;
      }

      if (error) throw error;
      
      const transformed = Array.isArray(data) && data.length > 0
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
  const getImageUrl = (imgs: any) => imgs && imgs.length ? imgs[0] : FALLBACK_IMG;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" text="Loading featured items..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button onClick={fetchFeaturedItems} variant="outline" size="sm" className="min-h-[44px]">
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
      <div className="text-center py-8 px-4">
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          No featured items available at the moment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button onClick={fetchFeaturedItems} variant="outline" size="sm" className="min-h-[44px]">
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
      opts={{ align: "start", loop: false, dragFree: true }}
      className="w-full max-w-6xl mx-auto relative"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="pl-2 md:pl-4 basis-[85%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <FeaturedItemCard
              item={item}
              formatPrice={formatPrice}
              getImageUrl={getImageUrl}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default FeaturedItems;
