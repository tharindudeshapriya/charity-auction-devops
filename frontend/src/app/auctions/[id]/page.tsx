"use client"

import { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Users, TrendingUp, History, ShieldCheck, Info, Loader2, Activity, BellRing } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '@/hooks/use-auth';

import { Item, itemService } from '@/lib/services/item-service';

export default function ItemDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidInput, setBidInput] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [bids, setBids] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected');

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      try {
        const data = await itemService.getItemById(id);
        setItem(data);
        setCurrentBid(data.currentHighestBid);
        setBidInput(data.currentHighestBid + 100);
        
        // Fetch historical bids
        const bidsData = await itemService.getItemBids(Number(id), 0, 50);
        const formattedBids = bidsData.content.map((b: any) => ({
          bidder: b.bidderUsername,
          amount: b.amount,
          time: new Date(b.bidTime).toLocaleString(),
          id: b.bidId
        }));
        setBids(formattedBids);
      } catch (err) {
        setError('Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  useEffect(() => {
    if (!item) return;
    const updateTime = () => {
      const end = new Date(item.auctionEndTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      if (diff <= 0) { setTimeLeft('Ended'); return; }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${mins}m ${secs}s`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [item]);

  useEffect(() => {
    if (!item || !user) return; // Only connect if item is loaded and user is logged in

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const socket = new SockJS(`${apiUrl}/ws-auction`);
    
    const stompClient = new Client({
        webSocketFactory: () => socket as any,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
        setConnectionStatus('connected');
        stompClient.subscribe(`/topic/items/${item.id}/bids`, (message) => {
            if (message.body) {
                const bid = JSON.parse(message.body);
                setBids(prev => {
                    if (prev.some(b => b.amount === bid.amount && b.bidder === bid.bidderName)) {
                        return prev;
                    }
                    const newBid = { 
                        bidder: bid.bidderName, 
                        amount: bid.amount, 
                        time: 'Just now',
                        id: bid.id || Date.now() + Math.random()
                    };
                    return [newBid, ...prev];
                });
                setCurrentBid(bid.amount);
            }
        });
    };

    stompClient.onStompError = () => {
        setConnectionStatus('error');
    };

    setConnectionStatus('connecting');
    stompClient.activate();

    return () => {
        stompClient.deactivate();
        setConnectionStatus('disconnected');
    };
  }, [item, user]);

  const handleBid = async () => {
    if (bidInput <= currentBid) {
      toast({
        title: "Invalid Bid",
        description: "Your bid must be higher than the current bid.",
        variant: "destructive",
      });
      return;
    }

    try {
      await itemService.placeBid(Number(id), bidInput);
      setCurrentBid(bidInput);
      setBids([{ bidder: user?.username || 'You', amount: bidInput, time: 'Just now' }, ...bids]);
      setBidInput(bidInput + 100);
      
      toast({
        title: "Success!",
        description: `You are now the highest bidder at $${bidInput.toLocaleString()}`,
      });
    } catch (error: any) {
      toast({
        title: "Bid Failed",
        description: error.message || "Failed to place bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
    </div>
  );
  if (error || !item) return <div className="min-h-screen bg-background flex items-center justify-center font-bold text-destructive">{error || 'Item not found'}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border bg-secondary/10 flex items-center justify-center">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-center px-4">Image To Be Updated</span>
              )}
              <div className="absolute top-6 left-6 flex gap-2">
                <Badge className="bg-primary/90 hover:bg-primary text-white px-4 py-1.5 rounded-full border-none font-bold">
                  {item.category || 'To Be Updated'}
                </Badge>
                <Badge className="bg-accent text-white px-4 py-1.5 rounded-full border-none font-bold flex gap-1 items-center">
                  <TrendingUp size={14} /> LIVE
                </Badge>
              </div>
            </div>
          </div>

          {/* Bidding Info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-headline font-bold text-primary leading-tight">{item.name}</h1>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                  <Timer size={18} className="text-accent" />
                  <span>Ends in: <span className="text-foreground font-bold">{timeLeft}</span></span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/30 p-8 rounded-3xl border border-primary/5 space-y-6">
              <div className="flex justify-between items-baseline">
                <span className="text-sm uppercase tracking-[0.2em] font-bold text-muted-foreground">Current High Bid</span>
                <span className="text-5xl font-headline font-bold text-primary">${currentBid.toLocaleString()}</span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                  <Input 
                    type="number" 
                    value={bidInput} 
                    onChange={(e) => setBidInput(Number(e.target.value))}
                    className="pl-8 py-8 text-2xl font-bold rounded-2xl border-2 border-primary/20 focus-visible:ring-accent"
                  />
                </div>
                <Button 
                  onClick={handleBid}
                  className="w-full py-8 text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  Place Bid Now
                </Button>
                <p className="text-center text-xs text-muted-foreground font-medium">
                  By bidding, you agree to our Terms of Service.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl border bg-card/50">
              <ShieldCheck className="text-green-500 shrink-0" size={24} />
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Safe & Secure Bidding</h4>
                <p className="text-xs text-muted-foreground">Your transactions are protected with high-grade encryption and expert authentication.</p>
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-xl bg-secondary/50 p-1">
                <TabsTrigger value="description" className="rounded-lg font-bold">Details</TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg font-bold">Live Feed</TabsTrigger>
                <TabsTrigger value="shipping" className="rounded-lg font-bold">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </TabsContent>
              <TabsContent value="history" className="pt-6">
                {!user ? (
                  <div className="p-8 text-center rounded-xl border bg-secondary/10 flex flex-col items-center gap-2">
                    <History size={32} className="text-muted-foreground/30 mb-2" />
                    <p className="font-bold text-lg">Log in to view live bid feed</p>
                    <p className="text-sm text-muted-foreground">Only authenticated users can view real-time bidding activity.</p>
                  </div>
                ) : (
                  <div className="border rounded-2xl bg-card overflow-hidden shadow-sm">
                    <div className="bg-primary/5 p-4 border-b flex justify-between items-center">
                      <div className="font-bold flex items-center gap-2 text-primary">
                        <Activity size={18} /> Live Bids Feed
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        </span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{connectionStatus}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                      {bids.length > 0 ? bids.map((bid, i) => (
                        <div key={bid.id || i} className={`flex justify-between items-center p-3 rounded-xl border transition-all ${i === 0 ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                              {bid.bidder ? bid.bidder[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-sm">
                                <span className={i === 0 ? "text-primary" : ""}>{bid.bidder}</span> placed a bid
                              </p>
                              <p className="text-xs text-muted-foreground">{bid.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-headline font-bold text-primary">${bid.amount.toLocaleString()}</p>
                            {i === 0 && <Badge variant="outline" className="text-[9px] uppercase font-bold text-primary border-primary/30 mt-1">Newest</Badge>}
                          </div>
                        </div>
                      )) : (
                        <div className="py-8 text-center flex flex-col items-center">
                          <BellRing size={24} className="text-muted-foreground/30 mb-2" />
                          <p className="font-bold text-muted-foreground text-sm uppercase tracking-widest">Listening for live bids...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}