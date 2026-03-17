"use client"

import { Item, itemService } from '@/lib/services/item-service';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreVertical, Edit2, Trash2, Eye, PlusCircle, Loader2, History } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ItemsManagementPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'CLOSED' | 'all'>('all');

  useEffect(() => {
    loadItems();
  }, [search]);

  const loadItems = async () => {
    setLoading(true);
    try {
      let result;
      if (search) {
        result = await itemService.searchItems(search);
      } else {
        result = await itemService.getItems();
      }
      setItems(result.content);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to load inventory.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to terminate this auction?')) return;
    try {
      // Assuming update status to CLOSED for deletion
      await itemService.updateItem(id, { status: 'CLOSED' });
      toast({ title: "Auction Terminated", description: "The listing has been closed." });
      loadItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to close auction.", variant: "destructive" });
    }
  };

  if (user?.role !== 'ADMIN' && user?.role !== 'ORGANIZER' && user?.role !== 'BIDDER') return null;
  
  const isManagement = user?.role === 'ADMIN' || user?.role === 'ORGANIZER';

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    const newItem = {
      name: target.elements.name.value,
      description: target.elements.description.value,
      startingPrice: Number(target.elements.startingBid.value),
      auctionEndTime: target.elements.endsAt.value,
    };
    
    setIsSubmitting(true);
    try {
      await itemService.createItem(newItem);
      setIsSubmitting(false);
      setOpen(false);
      toast({ title: "Auction Listed", description: "The item has been published successfully." });
      loadItems();
    } catch (err: any) {
      setIsSubmitting(false);
      toast({ title: "Error", description: err.message || "Failed to list item.", variant: "destructive" });
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const target = e.target as any;
    const updatedFields = {
      name: target.elements.name.value,
      description: target.elements.description.value,
      startingPrice: Number(target.elements.startingBid.value),
      auctionEndTime: target.elements.endsAt.value,
      status: target.elements.status.value,
    };
    
    setIsSubmitting(true);
    try {
      await itemService.updateItem(editingItem.id, updatedFields);
      setIsSubmitting(false);
      setEditOpen(false);
      setEditingItem(null);
      toast({ title: "Listing Updated", description: "The item details have been saved." });
      loadItems();
    } catch (err: any) {
      setIsSubmitting(false);
      toast({ title: "Update Failed", description: err.message || "Could not save changes.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-primary">
            {isManagement ? "Items Management" : "Auction Gallery"}
          </h1>
          <p className="text-muted-foreground">
            {isManagement 
              ? "Monitor and manage all auction listings across the platform." 
              : "Explore and track elite charity auctions open for bidding."}
          </p>
        </div>

        {isManagement && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full px-6 bg-primary font-bold gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <PlusCircle size={18} /> Add Item Manually
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] w-[95vw] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
              <form onSubmit={handleAddItem} className="flex flex-col h-full overflow-hidden">
                <ScrollArea className="flex-1 overflow-y-auto">
                  <div className="p-6 md:p-8 space-y-8">
                    <DialogHeader className="space-y-2">
                      <DialogTitle className="text-2xl md:text-3xl font-headline font-bold text-primary text-left">New Auction Listing</DialogTitle>
                      <DialogDescription className="text-sm md:text-base text-left">
                        Establish a new high-value listing for the global community.
                      </DialogDescription>
                    </DialogHeader>
  
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Item Name</Label>
                          <Input id="name" name="name" placeholder="e.g. Signed Picasso Sketch" required className="py-6 rounded-xl border-2 border-secondary focus:border-primary/20 bg-secondary/5" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="startingBid" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Starting Bid ($)</Label>
                          <Input id="startingBid" name="startingBid" type="number" placeholder="5000" required className="py-6 rounded-xl border-2 border-secondary focus:border-primary/20 bg-secondary/5" />
                        </div>
                      </div>
  
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="endsAt" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Auction End Date</Label>
                          <Input id="endsAt" name="endsAt" type="datetime-local" required className="py-6 rounded-xl border-2 border-secondary focus:border-primary/20 bg-secondary/5" />
                        </div>
                      </div>
  
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Item Description & Provenance</Label>
                        <Textarea id="description" name="description" placeholder="Detail the item's history, condition, and charitable impact..." className="min-h-[120px] rounded-2xl border-2 border-secondary focus:border-primary/20 bg-secondary/5 p-4" required />
                      </div>
  
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Item Gallery</Label>
                        <div className="relative group cursor-pointer text-[10px] text-muted-foreground">
                          Backend currently does not store images. This will use a placeholder.
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
  
                <div className="bg-secondary/20 p-6 md:p-8 flex flex-col sm:flex-row justify-end gap-3 md:gap-4 border-t border-border/50 shrink-0">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-full px-8 font-bold text-muted-foreground order-2 sm:order-1">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-full px-10 bg-primary font-bold shadow-xl shadow-primary/20 order-1 sm:order-2">
                    {isSubmitting ? "Listing Item..." : "Publish Auction"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-[2rem]">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-border/50 bg-secondary/10 backdrop-blur-md gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search global inventory..." 
                className="pl-12 py-6 rounded-xl border-2 border-secondary/50 bg-background focus:border-primary/20 transition-colors" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select onValueChange={(v: any) => setStatusFilter(v)} defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] py-6 rounded-xl border-2 border-secondary/50 bg-background focus:ring-primary/20 font-bold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="ACTIVE">Active Only</SelectItem>
                <SelectItem value="CLOSED">Closed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="sm" className="w-full md:w-auto gap-2 rounded-xl py-6 px-6 border-2 border-secondary/50 bg-background hover:bg-secondary/20 hover:border-primary/20 transition-all font-bold" onClick={loadItems}>
            <History size={18} /> Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="h-8 w-8 text-primary animate-spin" />
             </div>
          ) : (
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-bold py-6 px-8 whitespace-nowrap">Item Description</TableHead>
                <TableHead className="font-bold text-center whitespace-nowrap">Status</TableHead>
                <TableHead className="font-bold text-right whitespace-nowrap">Current Bid</TableHead>
                <TableHead className={`font-bold text-right whitespace-nowrap ${isManagement ? 'pr-8' : 'pr-12'}`}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="group transition-colors border-b border-border/50">
                  <TableCell className="py-6 px-8 min-w-[200px]">
                    <div className="font-bold text-primary group-hover:text-accent transition-colors">{item.name}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SKU: {item.id}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.status === 'ACTIVE' ? 'default' : 'secondary'} className={`rounded-full font-bold px-4 ${item.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600 border-green-500/20' : ''}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-headline font-bold text-lg text-primary">${item.currentHighestBid.toLocaleString()}</TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 transition-colors">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px]">
                        <DropdownMenuItem asChild className="gap-3 py-3 rounded-xl cursor-pointer">
                          <Link href={`/auctions/${item.id}`}>
                            <Eye size={16} className="text-muted-foreground" /> 
                            <span className="font-bold">View Listing</span>
                          </Link>
                        </DropdownMenuItem>
                        
                        {isManagement && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => {
                                setTimeout(() => {
                                  setEditingItem(item);
                                  setEditOpen(true);
                                }, 80);
                              }} 
                              className="gap-3 py-3 rounded-xl cursor-pointer"
                            >
                              <Edit2 size={16} className="text-muted-foreground" /> 
                              <span className="font-bold">Modify Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2" />
                            <DropdownMenuItem onClick={() => handleDelete(item.id)} className="gap-3 py-3 rounded-xl cursor-pointer text-destructive focus:bg-destructive/5 focus:text-destructive">
                              <Trash2 size={16} /> 
                              <span className="font-bold">Terminate Auction</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditingItem(null); }}>
        <DialogContent className="sm:max-w-[700px] w-[95vw] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
          {editingItem && (
            <form onSubmit={handleUpdateItem} className="flex flex-col h-full overflow-hidden">
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 space-y-8">
                  <DialogHeader className="space-y-2">
                    <DialogTitle className="text-2xl md:text-3xl font-headline font-bold text-primary text-left">Edit Auction # {editingItem.id}</DialogTitle>
                    <DialogDescription className="text-sm md:text-base text-left">
                      Modify listing details or update the status of this high-value item.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Item Name</Label>
                        <Input id="edit-name" name="name" defaultValue={editingItem.name} required className="py-6 rounded-xl border-2 border-secondary focus:border-primary/20 bg-secondary/5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-status" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Auction Status</Label>
                        <Select name="status" defaultValue={editingItem.status}>
                          <SelectTrigger className="py-6 rounded-xl border-2 border-secondary focus:border-primary/20 bg-secondary/5">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="ACTIVE">ACTIVE (Open for Bids)</SelectItem>
                            <SelectItem value="CLOSED">CLOSED (Auction Ended)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-startingBid" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Base Price ($)</Label>
                        <Input id="edit-startingBid" name="startingBid" type="number" defaultValue={editingItem.startingPrice} required className="py-6 rounded-xl border-2 border-secondary focus:border-primary/20 bg-secondary/5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-endsAt" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">New End Date (Optional)</Label>
                        <Input id="edit-endsAt" name="endsAt" type="datetime-local" defaultValue={editingItem.auctionEndTime ? new Date(editingItem.auctionEndTime).toISOString().slice(0, 16) : ''} required className="py-6 rounded-xl border-2 border-secondary focus:border-primary/20 bg-secondary/5" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Description & Pedigree</Label>
                      <Textarea id="edit-description" name="description" defaultValue={editingItem.description} className="min-h-[120px] rounded-2xl border-2 border-secondary focus:border-primary/20 bg-secondary/5 p-4" required />
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="bg-secondary/20 p-6 md:p-8 flex flex-col sm:flex-row justify-end gap-3 md:gap-4 border-t border-border/50 shrink-0">
                <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} className="rounded-full px-8 font-bold text-muted-foreground order-2 sm:order-1">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-full px-10 bg-primary font-bold shadow-xl shadow-primary/20 order-1 sm:order-2">
                  {isSubmitting ? "Saving Changes..." : "Update Listing"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

