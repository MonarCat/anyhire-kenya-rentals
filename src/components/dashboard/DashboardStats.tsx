
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Users, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type DashboardStatsProps = {
  currentPlan: any;
  userItemCount: number;
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ currentPlan, userItemCount }) => (
  <>
    {currentPlan && (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan: {currentPlan.name}</span>
            <Badge variant={currentPlan.id === "silver" ? "secondary" : "default"}>
              {currentPlan.price === 0 ? "Free" : `KES ${currentPlan.price}/month`}
            </Badge>
          </CardTitle>
          <CardDescription>
            You've used {userItemCount} of {currentPlan.itemLimit === Infinity ? "∞" : currentPlan.itemLimit} listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width:
                      currentPlan.itemLimit === Infinity
                        ? "0%"
                        : `${Math.min((userItemCount / currentPlan.itemLimit) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <Button asChild variant="outline" className="ml-4">
              <Link to="/pricing">Upgrade Plan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userItemCount}</div>
          <p className="text-xs text-muted-foreground">Active items listed</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Items currently rented</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">KES 0</div>
          <p className="text-xs text-muted-foreground">Start listing to earn</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Item page views</p>
        </CardContent>
      </Card>
    </div>
  </>
);

export default DashboardStats;
