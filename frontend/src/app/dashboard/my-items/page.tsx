"use client"

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Timer, Eye, Edit, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MyItemsPage() {
  const { user } = useAuth();
  if (user?.role !== 'ORGANIZER') return null;

  // Personal items list not currently available via backend
  const myItems: any[] = [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-primary">My Auction Items</h1>
          <p className="text-muted-foreground">Manage the unique items you've curated for the platform.</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="rounded-full gap-2 bg-primary font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <PlusCircle size={18} /> Add New Listing
          </Button>
        </Link>
      </div>

      {myItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {myItems.map((item) => (
            <Card key={item.id} className="border-none shadow-sm overflow-hidden group">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline font-bold text-xl group-hover:text-primary transition-colors">{item.name}</h3>
                      <Badge className="font-bold">{item.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium mb-4">
                      <div className="flex items-center gap-1"><Timer size={14} className="text-accent" /> 2d left</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Current High Bid</p>
                      <p className="text-2xl font-headline font-bold text-primary">${item.currentBid.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                        <Eye size={18} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                        <Edit size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-6 bg-secondary/10 rounded-[2.5rem] border-2 border-dashed border-border/50">
          <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <PackageSearch size={36} className="text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-headline font-bold text-muted-foreground">My Items: To Be Updated</p>
            <p className="text-muted-foreground max-w-md mx-auto">This feature is currently pending backend integration.</p>
          </div>
          <Link href="/dashboard/create" className="inline-block">
            <Button className="rounded-full px-10 bg-primary font-bold shadow-xl shadow-primary/20">
              Create First Listing
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
