"use client"

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, ShieldCheck, Heart, Gavel, Truck } from 'lucide-react';

export default function FAQPage() {
  const faqSections = [
    {
      icon: Gavel,
      title: "Bidding & Auctions",
      items: [
        {
          q: "How do I place a bid?",
          a: "Once you are logged into your account, navigate to any live auction item and enter your desired bid amount in the bid box. Your bid must meet the minimum increment. You will be notified immediately if you are the highest bidder or if you have been outbid."
        },
        {
          q: "Can I cancel a bid once it's placed?",
          a: "No. All bids placed on CommuniBid are legally binding contracts. Please ensure you have reviewed the item details and valuation before placing your bid."
        },
        {
          q: "What is an 'Anonymous Bid'?",
          a: "You can enable anonymous bidding in your account settings. This will mask your name as 'B***r' on the public bidding history while still allowing you to participate fully in the auction."
        }
      ]
    },
    {
      icon: Heart,
      title: "Impact & Charities",
      items: [
        {
          q: "How much of my bid goes to charity?",
          a: "CommuniBid is committed to maximum impact. 98% of the net proceeds from every auction go directly to the designated charity partner. The remaining 2% covers essential platform maintenance and secure payment processing."
        },
        {
          q: "Are the charities verified?",
          a: "Yes. Every charity on our platform undergoes a rigorous multi-step verification process to ensure they are registered non-profits with proven track records of impact and financial transparency."
        }
      ]
    },
    {
      icon: Truck,
      title: "Shipping & Fulfillment",
      items: [
        {
          q: "How are high-value items shipped?",
          a: "We partner with specialized white-glove logistics providers who excel in handling luxury items, fine art, and jewelry. All shipments are fully insured and require a signature upon delivery."
        },
        {
          q: "Who pays for shipping?",
          a: "Shipping costs are generally the responsibility of the winning bidder, unless otherwise stated in the item description. Estimated shipping costs can be provided by our concierge team prior to the auction close."
        }
      ]
    },
    {
      icon: ShieldCheck,
      title: "Security & Payments",
      items: [
        {
          q: "Is my payment information secure?",
          a: "We use bank-level 256-bit encryption and partner with industry-leading payment processors. CommuniBid never stores your full credit card details on our servers."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard, American Express), as well as wire transfers for high-value transactions over $50,000."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <section className="container mx-auto px-6 mb-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 text-primary font-bold uppercase tracking-widest text-[10px]">
              Support Center
            </Badge>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Everything you need to know about the CommuniBid experience and how your contribution makes a difference.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-16">
            {faqSections.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary">
                    <section.icon size={24} />
                  </div>
                  <h2 className="text-2xl font-headline font-bold text-primary">{section.title}</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <AccordionItem 
                      key={itemIdx} 
                      value={`item-${idx}-${itemIdx}`}
                      className="border rounded-2xl px-6 bg-card hover:border-primary/20 transition-colors"
                    >
                      <AccordionTrigger className="text-left font-bold py-6 hover:no-underline text-primary">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 rounded-[2.5rem] bg-primary text-white text-center space-y-6 shadow-2xl shadow-primary/20">
            <HelpCircle size={48} className="mx-auto text-accent" />
            <h2 className="text-3xl font-headline font-bold">Still have questions?</h2>
            <p className="text-primary-foreground/70 max-w-md mx-auto">
              Our dedicated concierge team is available 24/7 to assist you with any inquiries regarding bidding, items, or our charity partners.
            </p>
            <div className="pt-4">
              <a href="/contact">
                <button className="bg-accent hover:bg-accent/90 text-white font-bold px-10 py-4 rounded-full transition-transform hover:scale-105">
                  Contact Support
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
