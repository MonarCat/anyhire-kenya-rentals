
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealtimeItems } from '@/hooks/useRealtimeItems';

const ActiveListingsSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { userItems, loading: itemsLoading } = useRealtimeItems();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Active Listings</CardTitle>
        <CardDescription>
          Real-time view of your items ({userItems.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {itemsLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : userItems.length === 0 ? (
          <div className="text-center text-gray-500">
            No items listed yet
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                    No image
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    KES {(item.price / 100).toLocaleString()}/{item.price_period}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${item.is_available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-xs text-gray-500">
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {userItems.length > 5 && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  View all {userItems.length} items
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveListingsSidebar;
