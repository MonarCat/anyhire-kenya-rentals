
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import LoadingSpinner from "@/components/LoadingSpinner";
import HomeButton from "@/components/HomeButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CategoryGrid = () => {
  const { categories, loading, error, refetch } = useCategories();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" text="Loading categories..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <HomeButton />
        </div>
      </div>
    );
  }
  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No categories available at the moment.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={refetch} variant="outline">
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
        {categories.map((category) => (
          <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
            <Link
              to={`/search?category=${encodeURIComponent(category.name)}`}
              className="block h-full"
            >
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group h-full active:scale-95 hover:scale-105">
                <CardContent className="p-3 md:p-6 text-center flex flex-col items-center h-full min-h-[120px] justify-center">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="mx-auto mb-2 w-12 h-12 md:w-16 md:h-16 object-cover rounded-full border bg-gray-100 group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="text-2xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">{category.icon || "📦"}</div>
                  )}
                  <h3 className="font-semibold text-xs md:text-sm leading-tight">{category.name}</h3>
                  {category.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 hidden sm:block">
                      {category.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default CategoryGrid;
