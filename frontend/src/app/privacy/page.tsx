"use client"

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information Collection",
      content: "We collect information you provide directly to us when you create an account, place a bid, or communicate with our concierge. This includes your name, email address, shipping address, and payment preferences."
    },
    {
      icon: Database,
      title: "How We Use Information",
      content: "Your information is used to facilitate auction transactions, verify your identity for high-value bids, provide customer support, and send you impact reports from the charities you've supported."
    },
    {
      icon: Lock,
      title: "Data Protection",
      content: "We implement industry-standard security measures, including 256-bit encryption and secure socket layers (SSL), to protect your personal data from unauthorized access, disclosure, or alteration."
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information at any time. You can manage your privacy preferences and data visibility through your account settings."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <section className="container mx-auto px-6 mb-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 text-primary font-bold uppercase tracking-widest text-[10px]">
              Privacy & Trust
            </Badge>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We are committed to protecting your personal data and your philanthropic legacy with the highest level of integrity.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {sections.map((section, idx) => (
              <div key={idx} className="p-8 rounded-3xl border bg-card hover:shadow-xl transition-all space-y-4">
                <div className="p-3 rounded-2xl bg-accent/10 text-accent w-fit">
                  <section.icon size={24} />
                </div>
                <h2 className="text-xl font-headline font-bold text-primary">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 prose prose-primary max-w-none border-t pt-12 space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">Cookies & Tracking</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By using our platform, you consent to our use of cookies in accordance with this policy.
            </p>
            <h2 className="text-2xl font-headline font-bold text-primary">Third-Party Disclosure</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We do not sell or trade your personal information. We only share data with verified charity partners (to provide tax receipts) and logistics providers (to fulfill shipments).
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
