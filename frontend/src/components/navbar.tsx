"use client"

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { Gavel, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/auctions', label: 'Gallery' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 bg-background/70 backdrop-blur-xl border-b shadow-sm ${isScrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="bg-primary p-2.5 rounded-xl text-primary-foreground group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            <Gavel size={22} />
          </div>
          <span className="text-2xl font-headline font-bold tracking-tight text-primary">CommuniBid</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-bold text-primary/80 hover:text-accent transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2 font-bold rounded-full">
                    <LayoutDashboard size={16} />
                    Portal
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 font-bold rounded-full">
                      <LogOut size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-headline font-bold">Sign Out</AlertDialogTitle>
                      <AlertDialogDescription className="text-base">
                        Are you sure you want to sign out?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-4">
                      <AlertDialogCancel className="rounded-full px-8 font-bold border-2">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={logout}
                        className="rounded-full px-8 font-bold bg-destructive hover:bg-destructive/90 text-white"
                      >
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 shadow-xl shadow-primary/20 font-bold transition-all hover:scale-105">
                  Join Auction
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-0 bg-background/95 backdrop-blur-xl">
              <SheetHeader className="mb-12">
                <SheetTitle className="text-left flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-lg text-white">
                    <Gavel size={18} />
                  </div>
                  <span className="font-headline font-bold text-primary">CommuniBid</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-headline font-bold text-primary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="pt-8 border-t">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start gap-4 py-7 rounded-2xl font-bold" variant="secondary">
                          <LayoutDashboard size={20} />
                          Go to Portal
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-4 py-7 rounded-2xl font-bold text-destructive hover:bg-destructive/5"
                          >
                            <LogOut size={20} />
                            Logout
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2rem] w-[90vw] max-w-md mx-auto">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-headline font-bold">Sign Out</AlertDialogTitle>
                            <AlertDialogDescription className="text-base">
                              Are you sure you want to leave?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-8 gap-4 flex-col sm:flex-row">
                            <AlertDialogCancel className="rounded-full py-6 font-bold flex-1 border-2">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => { logout(); setIsOpen(false); }}
                              className="rounded-full py-6 font-bold flex-1 bg-destructive hover:bg-destructive/90 text-white"
                            >
                              Logout
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full py-7 rounded-2xl bg-primary font-bold shadow-xl shadow-primary/20">
                        Join Elite Community
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}