"use client"

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using the CommuniBid platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      title: "2. Eligibility",
      content: "You must be at least 18 years of age to participate in any auction. By creating an account, you represent and warrant that you have the legal capacity to enter into a binding contract."
    },
    {
      title: "3. Bidding & Binding Contracts",
      content: "Every bid placed on the platform is a legally binding offer to purchase the item at the bid price. If you are the winning bidder at the close of an auction, you are legally obligated to complete the transaction. Retracting bids is strictly prohibited."
    },
    {
      title: "4. Payments & Charity Proceeds",
      content: "Payments for won items must be settled within 48 hours of auction close. CommuniBid acts as a facilitator; 98% of the net proceeds are disbursed to our verified charity partners. All sales are final, and no refunds will be issued unless an item is proven to be significantly different from its description."
    },
    {
      title: "5. Intellectual Property",
      content: "The content on this platform, including text, graphics, logos, and images, is the property of CommuniBid or its item donors and is protected by international copyright laws."
    },
    {
      title: "6. Limitation of Liability",
      content: "CommuniBid shall not be held liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the platform, even if CommuniBid has been advised of the possibility of such damages."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <section className="container mx-auto px-6 mb-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 text-primary font-bold uppercase tracking-widest text-[10px]">
              Legal Documentation
            </Badge>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">Terms of Service</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Last Updated: October 2023. Please read these terms carefully before participating in our auctions.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-primary max-w-none space-y-12">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-2xl font-headline font-bold text-primary">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 rounded-2xl bg-secondary/30 border border-primary/5 italic text-sm text-muted-foreground">
            Questions regarding these terms should be directed to our legal department at <span className="text-primary font-bold">legal@communibid.com</span>.
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
