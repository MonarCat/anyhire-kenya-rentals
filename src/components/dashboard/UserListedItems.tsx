
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Plus, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmptyState from "@/components/common/EmptyState";

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
    
    try {
      const { error } = await supabase.from("items").delete().eq("id", itemId);
      if (error) throw error;
      
      toast({
        title: "Item Deleted",
        description: "Your listing was deleted successfully.",
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete item.",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  const handlePromote = async (itemId: string) => {
    setPromoting(itemId);
    
    try {
      const { error } = await supabase
        .from("items")
        .update({ is_featured: true, ad_type: "featured" })
        .eq("id", itemId);
        
      if (error) throw error;
      
      toast({
        title: "Item Promoted",
        description: "Your listing is now featured!",
      });
    } catch (error: any) {
      console.error('Promotion error:', error);
      toast({
        title: "Promotion Failed",
        description: error.message || "Failed to promote item.",
        variant: "destructive",
      });
    } finally {
      setPromoting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading your items...</span>
      </div>
    );
  }

  if (userItems.length === 0) {
    return (
      <EmptyState
        icon={<Package className="w-12 h-12" />}
        title="No items listed yet"
        description="Start earning by listing your first item for rent"
        actionLabel="List Your First Item"
        actionHref="/list-item"
      />
    );
  }

  return (
    <div className="space-y-4">
      {userItems.map((listing) => {
        console.log('Rendering listing:', listing.id, listing.title);
        
        return (
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
              <p className="text-sm text-muted-foreground">
                KES {(listing.price / 100).toLocaleString()}/{listing.price_period} • {listing.view_count || 0} views • {listing.booking_count || 0} bookings
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={listing.is_available ? "default" : "secondary"}>
                  {listing.is_available ? "Active" : "Inactive"}
                </Badge>
                {listing.is_featured && (
                  <Badge className="bg-yellow-500 text-black">Featured</Badge>
                )}
                {listing.categories && (
                  <Badge variant="outline" className="text-xs">
                    {listing.categories.name}
                  </Badge>
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
                className="text-red-600 hover:text-red-700"
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
                  className="text-yellow-600 hover:text-yellow-700"
                  onClick={() => handlePromote(listing.id)}
                  disabled={promoting === listing.id}
                  title="Promote/Feature"
                >
                  <Plus className="w-4 h-4" />
                  {promoting === listing.id && (
                    <span className="ml-1 text-xs">Promoting...</span>
                  )}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserListedItems;
