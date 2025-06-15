import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Plus, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type UserListedItemsProps = {
  userItems: any[];
  loading: boolean;
};

const UserListedItems: React.FC<UserListedItemsProps> = ({ userItems, loading }) => {
  const { toast } = useToast();
  const [removing, setRemoving] = useState<string | null>(null);
  const [promoting, setPromoting] = useState<string | null>(null);

  const handleDelete = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setRemoving(itemId);
    const { error } = await supabase.from("items").delete().eq("id", itemId);
    if (error) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Item Deleted",
        description: "Your listing was deleted.",
      });
    }
    setRemoving(null);
  };

  const handlePromote = async (itemId: string) => {
    setPromoting(itemId);
    const { error } = await supabase
      .from("items")
      .update({ is_featured: true, ad_type: "featured" })
      .eq("id", itemId);
    if (error) {
      toast({
        title: "Promotion Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Item Promoted",
        description: "Your listing is now featured!",
      });
    }
    setPromoting(null);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }
  if (userItems.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No items listed yet</h3>
        <p className="text-gray-600 mb-4">Start earning by listing your first item for rent</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to="/list-item">
            <Plus className="w-4 h-4 mr-2" />
            List Your First Item
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {userItems.map((listing) => (
        <div
          key={listing.id}
          className={`flex items-center space-x-4 p-4 border rounded-lg transition-shadow hover:shadow-md ${
            listing.is_featured ? "ring-2 ring-yellow-500/70" : ""
          }`}
        >
          <img
            src={
              listing.images && listing.images.length > 0
                ? listing.images[0]
                : "/placeholder.svg"
            }
            alt={listing.title}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{listing.title}</h3>
            <p className="text-sm text-gray-600 whitespace-nowrap">
              KES {(listing.price / 100).toLocaleString()}/{listing.price_period} • {listing.view_count} views • {listing.booking_count} bookings
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={listing.is_available ? "default" : "secondary"}>
                {listing.is_available ? "Active" : "Inactive"}
              </Badge>
              {listing.is_featured && (
                <Badge className="bg-yellow-500 text-black">Featured</Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-1 md:gap-2 items-center">
            <Button size="sm" variant="ghost" asChild title="View">
              <Link to={`/item/${listing.id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="sm" variant="ghost" asChild title="Edit">
              <Link to={`/edit-item/${listing.id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600"
              onClick={() => handleDelete(listing.id)}
              disabled={removing === listing.id}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
              {removing === listing.id && (
                <span className="ml-1 text-xs">Deleting...</span>
              )}
            </Button>
            {!listing.is_featured && (
              <Button
                size="sm"
                variant="ghost"
                className="text-yellow-600"
                onClick={() => handlePromote(listing.id)}
                disabled={promoting === listing.id}
                title="Promote/Feature"
              >
                <Plus className="w-4 h-4" />
                {promoting === listing.id && (
                  <span className="ml-1 text-xs">Promoting...</span>
                )}
                <span className="sr-only">Feature</span>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserListedItems;
