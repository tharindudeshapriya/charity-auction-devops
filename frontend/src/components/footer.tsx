import Link from 'next/link';
import { Gavel, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-6 max-w-md flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2">
              <Gavel className="text-primary" size={24} />
              <span className="text-2xl font-headline font-bold text-primary">CommuniBid</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering communities through transparent, high-impact charity auctions. Join us in making a difference, one bid at a time.
            </p>
            <div className="flex gap-4">
              <Twitter className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" size={20} />
              <Facebook className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" size={20} />
              <Instagram className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" size={20} />
              <Linkedin className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" size={20} />
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CommuniBid. All rights reserved. Built for professional charity excellence.
        </div>
      </div>
    </footer>
  );
}