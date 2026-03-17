"use client"
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuctionCard } from '@/components/auction-card';
import { Item, itemService } from '@/lib/services/item-service';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuctionGallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'CLOSED' | 'all'>('ACTIVE');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    loadItems();
  }, [search]); // Reload when search changes

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (search) {
        result = await itemService.searchItems(search, 0, 100);
      } else {
        result = await itemService.getItems(0, 100);
      }
      setItems(result.content);
      setCurrentPage(0);
    } catch (err) {
      setError('Failed to load auctions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl font-headline font-bold text-primary">Live Auction Gallery</h1>
          <p className="text-muted-foreground text-lg">Browse through unique treasures and once-in-a-lifetime experiences.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <form onSubmit={(e) => { e.preventDefault(); loadItems(); }}>
              <Input 
                placeholder="Search by item name or keywords..." 
                className="pl-12 py-6 text-base rounded-xl border-border bg-white dark:bg-card shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Select onValueChange={(v: any) => { setStatusFilter(v); setCurrentPage(0); }} defaultValue="ACTIVE">
              <SelectTrigger className="w-full md:w-[200px] py-6 rounded-xl bg-white dark:bg-card shadow-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active Auctions</SelectItem>
                <SelectItem value="CLOSED">Ended Auctions</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="py-6 rounded-xl gap-2 px-6" onClick={loadItems}>
              <SlidersHorizontal size={18} /> Refresh
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium">Curating your experience...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 space-y-4 bg-destructive/5 rounded-3xl border-2 border-dashed border-destructive/20">
            <div className="text-2xl font-headline font-bold text-destructive">{error}</div>
            <Button onClick={loadItems}>Try Again</Button>
          </div>
        ) : paginatedItems.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {paginatedItems.map((item) => (
                <AuctionCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 pt-8 border-t">
                <Button 
                  disabled={currentPage === 0} 
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  variant="outline"
                  className="rounded-full px-8 py-6 font-bold"
                >
                  Previous
                </Button>
                <div className="font-headline font-bold text-primary">
                  Page {currentPage + 1} of {totalPages}
                </div>
                <Button 
                  disabled={currentPage === totalPages - 1} 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  variant="outline"
                  className="rounded-full px-8 py-6 font-bold border-primary text-primary hover:bg-primary/5"
                >
                  Next Page
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 space-y-4 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
            <div className="text-4xl font-headline font-bold text-primary/40">No items found</div>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            <Button variant="link" onClick={() => {setSearch(''); setStatusFilter('ACTIVE');}}>Clear all filters</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}