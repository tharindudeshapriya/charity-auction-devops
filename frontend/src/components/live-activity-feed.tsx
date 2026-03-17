"use client"

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BellRing } from "lucide-react";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Item } from "@/lib/services/item-service";

interface BidEvent {
  id: number;
  itemId: number;
  amount: number;
  bidderName: string;
  bidTime: string;
}

export function LiveActivityFeed({ featuredItems }: { featuredItems: Item[] }) {
  const [liveBids, setLiveBids] = useState<(BidEvent & { itemName: string })[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    if (!featuredItems || featuredItems.length === 0) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const socket = new SockJS(`${apiUrl}/ws-auction`);
    
    const stompClient = new Client({
        webSocketFactory: () => socket as any,
        debug: (str) => {
            // console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
        setConnectionStatus('connected');
        
        featuredItems.forEach(item => {
            stompClient.subscribe(`/topic/items/${item.id}/bids`, (message) => {
                if (message.body) {
                    const bid: BidEvent = JSON.parse(message.body);
                    setLiveBids(prev => {
                        const newBid = { ...bid, itemName: item.name };
                        // Keep only the last 10 bids
                        return [newBid, ...prev].slice(0, 10);
                    });
                }
            });
        });
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        setConnectionStatus('error');
    };

    stompClient.activate();

    return () => {
        stompClient.deactivate();
    };
  }, [featuredItems]);

  return (
    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md overflow-hidden min-h-[300px] flex flex-col">
      <CardHeader className="border-b bg-background/50 pb-4">
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline flex items-center gap-2">
                <Activity size={20} className="text-primary" /> 
                Live Bid Feed
            </CardTitle>
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase">{connectionStatus}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow relative">
        {liveBids.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground/60 w-full min-h-[200px]">
                <BellRing size={32} className="mb-4 opacity-20" />
                <p className="font-medium">Listening for live bids...</p>
                <p className="text-sm mt-2">Bids placed on featured items will appear here instantly.</p>
            </div>
        ) : (
            <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
                {liveBids.map((bid, i) => (
                    <div key={`${bid.id}-${i}`} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {bid.bidderName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-sm">
                                    <span className="text-primary">{bid.bidderName}</span> placed a bid
                                </p>
                                <p className="text-xs text-muted-foreground font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                    on {bid.itemName}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-headline font-bold text-lg text-primary">${bid.amount.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Just now</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
