"use client"

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, History, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { userService } from '@/lib/services/user-service';
import { useState, useEffect } from 'react';

export default function BiddingHistoryPage() {
  const { user } = useAuth();
  
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const result = await userService.getMyBids(0, 50);
        setHistory(result.content);
      } catch (err) {
        console.error('Failed to load bid history', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'BIDDER') {
      loadHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (user?.role !== 'BIDDER') return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-4xl font-headline font-bold text-primary">Bidding History</h1>
        <p className="text-muted-foreground">A complete record of your contributions and activity on CommuniBid.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-bold">Item</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Your Bid</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <p className="text-muted-foreground">Loading history...</p>
                  </TableCell>
                </TableRow>
              ) : history.length > 0 ? history.map((entry) => (
                <TableRow key={entry.bidId} className="group cursor-pointer">
                  <TableCell>
                    <div className="font-bold group-hover:text-primary transition-colors">{entry.itemName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar size={14} /> {new Date(entry.bidTime).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-headline font-bold">${entry.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={entry.itemStatus === 'CLOSED' ? 'default' : 'secondary'} className="rounded-full font-bold px-3">
                      {entry.itemStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/auctions/${entry.itemId}`}>
                      <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <p className="text-xl font-headline font-bold text-muted-foreground uppercase tracking-widest">No Bidding History</p>
                    <p className="text-sm text-muted-foreground mt-2 inline-block">Once you place bids on items, they will appear here.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-12 flex justify-center">
        <div className="p-8 rounded-3xl border-2 border-dashed border-primary/20 flex flex-col justify-center items-center text-center space-y-4 max-w-2xl w-full">
          <h4 className="font-headline font-bold text-xl text-primary">Need help with an item?</h4>
          <p className="text-sm text-muted-foreground max-w-xs">Our concierge team is available 24/7 to assist with payment, shipping, or valuation questions.</p>
          <Button variant="outline" className="rounded-full px-8">Contact Concierge</Button>
        </div>
      </div>
    </div>
  );
}
