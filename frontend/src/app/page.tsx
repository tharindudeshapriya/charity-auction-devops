
"use client"

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuctionCard } from '@/components/auction-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Heart, Globe, Award, History } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LiveActivityFeed } from '@/components/live-activity-feed';
import { Badge } from '@/components/ui/badge';

import { itemService, Item } from '@/lib/services/item-service';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const result = await itemService.getItems(0, 50);
        // Get first 5 active items
        const activeItems = result.content
          .filter(item => item.status === 'ACTIVE')
          .slice(0, 5);
        setFeatured(activeItems);
      } catch (err) {
        console.error('Failed to load featured items', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const heroBgs = [
    'https://images.unsplash.com/photo-1574007557239-acf6863bc375?q=80&w=2070',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBgs.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroBgs.length]);

  return (
    <div className="relative min-h-screen hero-gradient  overflow-x-hidden">
      <Navbar />

      <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-background shadow-2xl border border-white/10">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            {heroBgs.map((bg, index) => (
              <div
                key={bg}
                className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${index === currentBg ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  backgroundImage: `url(${bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.5)'
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-black/20 to-black/90" />
          </div>

          <div className="container relative z-10 px-6 text-center text-white space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Badge variant="outline" className="mt-8 inline-flex items-center bg-white/10 backdrop-blur-md border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
              <Sparkles size={14} className="text-accent mr-2" />
              Modern Philanthropy, Reimagined
            </Badge>
            <h1 className="text-5xl md:text-8xl font-headline font-bold leading-tight max-w-5xl mx-auto italic">
              Bid for a <span className="text-accent not-italic">Purpose</span>, <br className="hidden md:block" /> Own a <span className="text-accent not-italic">Legacy</span>.
            </h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
              CommuniBid connects extraordinary items with extraordinary impact. Join an elite community of high-impact donors today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 pb-12">
              <Link href="/auctions" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white rounded-full px-12 py-8 text-xl font-bold shadow-2xl shadow-accent/40 transition-all hover:scale-105">
                  Explore Auctions
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/5 text-white border-white/40 hover:bg-white/10 backdrop-blur-md rounded-full px-12 py-8 text-xl font-bold transition-all border-2">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-24 bg-white dark:bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {[
                { icon: Heart, label: 'Impact Raised', value: '$2.4M+' },
                { icon: Globe, label: 'Global Bidders', value: '50k+' },
                { icon: Award, label: 'Curated Items', value: '1,200+' },
                { icon: Sparkles, label: 'Verified Charities', value: '85+' },
              ].map((stat, i) => (
                <div key={i} className="space-y-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="inline-flex p-4 rounded-2xl bg-primary/5 text-primary">
                    <stat.icon size={32} />
                  </div>
                  <div className="text-lg md:text-2xl font-headline font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Auctions Carousel */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none">
                  Closing Soon
                </Badge>
                <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary">Live Curations</h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Exclusive items and once-in-a-lifetime experiences hand-picked for their unique value and impact potential.
                </p>
              </div>
            </div>

            <div className="relative px-12">
              <Carousel 
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {featured.map((item) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                      <AuctionCard item={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-6 md:-left-12 h-12 w-12 border-primary/20 hover:bg-primary/5" />
                <CarouselNext className="-right-6 md:-right-12 h-12 w-12 border-primary/20 hover:bg-primary/5" />
              </Carousel>
            </div>

            <div className="mt-16 flex justify-center">
              <Link href="/auctions">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-12 py-8 text-xl font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-105 gap-3">
                  See all Items <ArrowRight size={24} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
