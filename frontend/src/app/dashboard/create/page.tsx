"use client"

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Save, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import { itemService } from '@/lib/services/item-service';
import { useRouter } from 'next/navigation';

export default function CreateItemPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    condition: '',
    keyFeatures: '',
    description: '',
    startingBid: '',
    endsAt: '',
  });

  const handlePublish = async () => {
    if (!formData.itemName || !formData.description || !formData.startingBid || !formData.endsAt) {
      toast({ title: "Incomplete Details", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setIsPublishing(true);
    try {
      await itemService.createItem({
        name: formData.itemName,
        description: formData.description,
        startingPrice: Number(formData.startingBid),
        auctionEndTime: formData.endsAt,
      });
      toast({ title: "Auction Published!", description: "Your item is now live in the gallery." });
      router.push('/dashboard/items');
    } catch (error: any) {
      toast({ title: "Publishing Failed", description: error.message || "Could not publish the auction.", variant: "destructive" });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleGenerateDescription = async () => {
    toast({
      title: "AI Assist: To Be Updated",
      description: "AI description generation is currently pending backend integration.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-4xl font-headline font-bold text-primary">Launch New Auction</h1>
        <p className="text-muted-foreground">Fill in the details to list your item for the community charity auction.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Item Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="itemName" className="font-bold">Item Name</Label>
                <Input 
                  id="itemName" 
                  placeholder="e.g. Vintage 1960s Chronograph" 
                  className="rounded-xl py-6"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-bold">Category</Label>
                  <Select onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="rounded-xl py-6">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Art">Art</SelectItem>
                      <SelectItem value="Jewelry">Jewelry</SelectItem>
                      <SelectItem value="Experience">Experience</SelectItem>
                      <SelectItem value="Collectibles">Collectibles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition" className="font-bold">Condition</Label>
                  <Select onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                    <SelectTrigger className="rounded-xl py-6">
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Pristine">Pristine</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Vintage - Excellent">Vintage - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endsAt" className="font-bold">Auction End Time</Label>
                <Input 
                  id="endsAt" 
                  type="datetime-local"
                  className="rounded-xl py-6"
                  required
                  value={formData.endsAt}
                  onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-headline">Item Description</CardTitle>
                <CardDescription>Draft a compelling story for your item.</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-full border-accent text-accent hover:bg-accent/5 font-bold"
                onClick={handleGenerateDescription}
                disabled={loading}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                AI Assist
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Describe your item in detail..." 
                className="min-h-[200px] rounded-xl text-base leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Financials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startingBid" className="font-bold">Starting Bid ($)</Label>
                <Input 
                  id="startingBid" 
                  type="number" 
                  placeholder="500" 
                  className="rounded-xl py-6 text-xl font-bold"
                  value={formData.startingBid}
                  onChange={(e) => setFormData({ ...formData, startingBid: e.target.value })}
                />
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-primary/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium uppercase">Listing Fee</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium uppercase">Commission</span>
                  <span className="font-bold">To Be Updated</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-4">
            <Button 
              className="w-full py-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg gap-3 shadow-xl shadow-primary/20"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? <Loader2 className="animate-spin" /> : <Send size={20} />} Publish Auction
            </Button>
            <Button variant="outline" className="w-full py-8 rounded-2xl font-bold text-lg gap-3" type="button">
              <Save size={20} /> Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}