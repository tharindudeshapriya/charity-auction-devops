"use client"

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gavel, Users } from 'lucide-react';

import { itemService, Item } from '@/lib/services/item-service';
import { userService } from '@/lib/services/user-service';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidderCount, setBidderCount] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await itemService.getItems(0, 50); // Fetch top items for stats
        setItems(result.content);
        
        // Fetch total bidders if user is ADMIN or ORGANIZER
        if (user && (user.role === 'ADMIN' || user.role === 'ORGANIZER')) {
             try {
                 const count = await userService.getTotalBidderCount();
                 setBidderCount(count);
             } catch(err) {
                 console.error('Failed to load bidder count', err);
             }
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
        loadData();
    }
  }, [user]);

  if (!user) return null;

  const activeAuctions = items.filter(i => i.status === 'ACTIVE').length;

  const isManagement = user.role === 'ADMIN' || user.role === 'ORGANIZER';

  const stats = [
    { label: 'Active Auctions', value: activeAuctions.toString(), icon: Gavel, color: 'text-primary bg-primary/5', subtext: "Platform-wide" },
    ...(isManagement ? [{ label: 'Total Bidders', value: bidderCount !== null ? bidderCount.toString() : '-', icon: Users, color: 'text-muted-foreground bg-secondary/20', subtext: "Registered on platform" }] : []),
  ];

  const chartData: any[] = [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-4xl font-headline font-bold text-primary">Welcome Back, {user.username}</h1>
        <p className="text-muted-foreground">Here is what is happening across CommuniBid today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle>
              <div className={`p-2 rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 italic">
                {stat.subtext}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Other sections could go here if needed, but the main charts/feeds are removed per request */}
      </div>
    </div>
  );
}
