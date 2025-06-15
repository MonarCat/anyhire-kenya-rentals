
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Plus, Trash2, Package } from "lucide-react";

type UserListedItemsProps = {
  userItems: any[];
  loading: boolean;
};

const UserListedItems: React.FC<UserListedItemsProps> = ({ userItems, loading }) => {
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
        <div key={listing.id} className="flex items-center space-x-4 p-4 border rounded-lg">
          <img
            src={listing.images && listing.images.length > 0 ? listing.images[0] : "/placeholder.svg"}
            alt={listing.title}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{listing.title}</h3>
            <p className="text-sm text-gray-600">
              KES {(listing.price / 100).toLocaleString()}/{listing.price_period} • {listing.view_count} views • {listing.booking_count} bookings
            </p>
          </div>
          <Badge variant={listing.is_available ? "default" : "secondary"}>
            {listing.is_available ? "active" : "inactive"}
          </Badge>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" asChild>
              <Link to={`/item/${listing.id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link to={`/edit-item/${listing.id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="sm" variant="ghost" className="text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserListedItems;
