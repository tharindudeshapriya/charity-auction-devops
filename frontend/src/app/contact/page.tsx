"use client"

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Message Sent",
        description: "Our concierge team will get back to you within 2 hours.",
      });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Call Us",
      value: "+41 22 555 0123",
      desc: "Mon-Sun, 24/7 Priority Support"
    },
    {
      icon: Mail,
      label: "Email Us",
      value: "hello@communibid.com",
      desc: "General inquiries & partnerships"
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: "123 Auction Way, Geneva, CH",
      desc: "By appointment only"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header */}
        <section className="container mx-auto px-6 mb-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 text-primary font-bold uppercase tracking-widest text-[10px]">
              Concierge Support
            </Badge>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">How Can We Assist?</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you're looking to donate an item or need assistance with a high-value bid, our team is here for you.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              {contactInfo.map((info, idx) => (
                <Card key={idx} className="border-none shadow-sm bg-secondary/20">
                  <CardContent className="p-8 flex gap-6 items-start">
                    <div className="p-3 rounded-2xl bg-white text-primary shadow-sm shrink-0">
                      <info.icon size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{info.label}</p>
                      <p className="text-xl font-headline font-bold text-primary">{info.value}</p>
                      <p className="text-sm text-muted-foreground">{info.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="p-8 rounded-[2.5rem] bg-primary text-white space-y-4">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-accent" />
                  <span className="text-sm font-bold uppercase tracking-widest">Response Time</span>
                </div>
                <h3 className="text-2xl font-headline font-bold">Priority Status</h3>
                <p className="text-primary-foreground/70 leading-relaxed text-sm">
                  Verified bidders and charity partners receive priority support with a guaranteed response time of under 2 hours.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-2xl shadow-primary/5 rounded-[3rem] overflow-hidden">
                <CardContent className="p-12">
                  {submitted ? (
                    <div className="text-center py-20 space-y-6 animate-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={48} />
                      </div>
                      <h2 className="text-4xl font-headline font-bold text-primary">Message Received</h2>
                      <p className="text-lg text-muted-foreground max-w-sm mx-auto">
                        Thank you for reaching out. A member of our concierge team has been assigned to your inquiry.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setSubmitted(false)}
                        className="rounded-full px-10 py-6 font-bold"
                      >
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                          <Input id="name" placeholder="John Doe" className="py-8 rounded-2xl border-2 border-secondary focus:border-primary/20 bg-secondary/5" required />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                          <Input id="email" type="email" placeholder="john@example.com" className="py-8 rounded-2xl border-2 border-secondary focus:border-primary/20 bg-secondary/5" required />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="subject" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
                        <Input id="subject" placeholder="High-Value Bid Inquiry" className="py-8 rounded-2xl border-2 border-secondary focus:border-primary/20 bg-secondary/5" required />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us how we can help..." 
                          className="min-h-[200px] rounded-3xl border-2 border-secondary focus:border-primary/20 bg-secondary/5 p-6" 
                          required 
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-8 text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-3xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] gap-3"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                        {loading ? "Sending Message..." : "Send to Concierge"}
                      </Button>
                      
                      <div className="flex items-center gap-2 justify-center text-muted-foreground">
                        <MessageSquare size={16} />
                        <span className="text-xs font-medium italic">Usually replies in under 2 hours</span>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
