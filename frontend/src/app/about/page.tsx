"use client"

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  ShieldCheck, 
  Globe, 
  Zap, 
  CheckCircle2, 
  Stethoscope,
  GraduationCap,
  Leaf,
  Palette,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {

  const values = [
    {
      icon: ShieldCheck,
      title: "Uncompromising Integrity",
      description: "We maintain the highest standards of transparency and security in every auction, ensuring trust between donors and bidders."
    },
    {
      icon: Heart,
      title: "Direct Impact",
      description: "Every successful bid directly empowers our partner charities to solve critical global challenges."
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "We connect extraordinary items with a worldwide network of passionate philanthropists and collectors."
    },
    {
      icon: Zap,
      title: "Innovation in Giving",
      description: "Leveraging cutting-edge technology to make charitable giving an engaging, real-time experience."
    }
  ];

  const impactAreas = [
    { icon: Stethoscope, label: "Healthcare", description: "Funding medical research and rural clinics." },
    { icon: GraduationCap, label: "Education", description: "Building schools and providing scholarships." },
    { icon: Leaf, label: "Environment", description: "Reforestation and ocean cleanup initiatives." },
    { icon: Palette, label: "Arts & Culture", description: "Preserving heritage and supporting local creators." }
  ];

  const steps = [
    {
      number: "01",
      title: "Expert Curation",
      description: "Our specialists authenticate and value every luxury item and unique experience donated to our platform."
    },
    {
      number: "02",
      title: "Elite Bidding",
      description: "Participate in real-time, transparent auctions with bidders from over 120 countries worldwide."
    },
    {
      number: "03",
      title: "Verifiable Impact",
      description: "98% of proceeds go directly to your chosen cause, with detailed impact reports sent to every winner."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-24 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 text-primary font-bold uppercase tracking-widest text-[10px]">
              Our Mission
            </Badge>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary leading-tight">
              Redefining Philanthropy Through <span className="text-accent italic">Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              CommuniBid was founded on a simple yet powerful idea: that extraordinary items should serve an extraordinary purpose. We are the premier destination for elite charity auctions.
            </p>
          </div>
        </section>

        {/* Vision & Story */}
        <section className="container mx-auto px-6 mb-32">
          <div className="max-w-4xl mx-auto space-y-12 text-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">The CommuniBid Story</h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                Established in Zurich, CommuniBid began as a small collective of art collectors and non-profit leaders who saw a gap in the luxury auction market. We realized that traditional auction houses often prioritized profit over social impact.
              </p>
              <p className="text-muted-foreground text-xl leading-relaxed">
                We set out to create a platform where transparency is paramount and the thrill of the bid is directly tied to global progress. Today, we have evolved into a worldwide network, facilitating millions in donations securely and transparently.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 text-primary font-bold shadow-sm">
                <CheckCircle2 size={20} className="text-accent" />
                <span>Verified Charity Partners</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 text-primary font-bold shadow-sm">
                <CheckCircle2 size={20} className="text-accent" />
                <span>Secure Escrow Payments</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 text-primary font-bold shadow-sm">
                <CheckCircle2 size={20} className="text-accent" />
                <span>Expert Item Valuation</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12 border-t">
              <div className="p-10 rounded-3xl bg-primary/5 border border-primary/10 hover:shadow-lg transition-all">
                <div className="text-6xl font-headline font-bold text-primary mb-2">150+</div>
                <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Global Charity Partners</div>
              </div>
              <div className="p-10 rounded-3xl bg-accent/5 border border-accent/10 hover:shadow-lg transition-all">
                <div className="text-6xl font-headline font-bold text-accent mb-2">98%</div>
                <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Funds Reached Cause Directly</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-secondary/20 py-24 mb-32 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">How CommuniBid Works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our seamless three-step process ensures a world-class experience for both donors and bidders.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
              <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-primary/20 -z-10" />
              {steps.map((step, i) => (
                <div key={i} className="text-center space-y-6 bg-background rounded-3xl p-8 shadow-sm border border-border">
                  <div className="w-20 h-20 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mx-auto shadow-sm">
                    <span className="text-3xl font-headline font-bold text-accent">{step.number}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold font-headline text-primary">{step.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Categories */}
        <section className="container mx-auto px-6 mb-32">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">Your Passion, Their Progress</h2>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-3xl mx-auto">
                We focus our efforts on four critical pillars of global development. Every item auctioned is tagged with the cause it supports, allowing you to bid on items that align with your personal philanthropic goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactAreas.map((area, i) => (
                <Card key={i} className="border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-secondary/10">
                  <CardContent className="p-8 text-center space-y-4 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                      <area.icon size={32} />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-xl text-primary mb-2">{area.label}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-primary py-24 text-white -mx-6 px-6 sm:-mx-0 sm:px-0">
          <div className="container mx-auto px-6 sm:px-0">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Core Pillars</h2>
              <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
                These principles guide every decision we make, from the items we curate to the partners we select.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors border-none">
                  <CardContent className="p-8 space-y-5 text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                      <value.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold font-headline">{value.title}</h3>
                    <p className="text-primary-foreground/60 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community CTA Section */}
        <section className="container mx-auto px-6 py-32">
          <div className="max-w-4xl mx-auto text-center space-y-10 bg-secondary/30 p-12 md:p-20 rounded-[3rem] border border-border shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-accent/10">
                <Sparkles size={120} />
             </div>
             <div className="absolute bottom-0 left-0 p-8 text-primary/5">
                <Globe size={160} />
             </div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary">Join a Community of Purpose</h2>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
                Whether you are looking to donate an item of significant value or seeking to acquire a unique treasure, you are part of something larger. CommuniBid is more than just an auction site; it's a movement towards intentional, high-impact giving.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-wrap justify-center gap-4 text-primary font-medium">
              {[
                "Exclusive access to authenticated luxury items",
                "Direct connection to verified global charities",
                "Real-time bidding with expert support",
                "Detailed impact reports for every purchase"
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-center bg-white dark:bg-card px-4 py-2 rounded-full border shadow-sm text-sm">
                  <Sparkles size={14} className="text-accent" />
                  {item}
                </div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-6 pt-8">
              <Link href="/auctions">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-10 py-7 font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 gap-2">
                  Explore Auctions <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto rounded-full px-10 py-7 font-bold text-lg border-primary text-primary hover:bg-primary/5">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
