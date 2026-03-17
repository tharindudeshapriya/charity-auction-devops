"use client"

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Mail, Lock, Gavel } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Note: Backend uses username for auth, so we'll use the email as username
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
              <Gavel size={32} />
            </div>
            <h1 className="text-3xl font-headline font-bold text-primary">Welcome to CommuniBid</h1>
            <p className="text-muted-foreground">Join the elite community of high-impact givers.</p>
          </div>

          <Card className="border-none shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="font-headline">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address / Username</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      type="text"
                      placeholder="Username"
                      className="pl-10 py-6 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="px-0 text-xs font-bold text-accent" type="button">Forgot password?</Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 py-6 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 font-bold" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-center text-xs text-muted-foreground w-full font-medium">
                Secure 256-bit encrypted connection.
              </p>
            </CardFooter>
          </Card>

          {/* Contact Admin to Join Section */}
          <div className="mt-8 text-center p-6 rounded-2xl bg-secondary/50 border border-border">
            <h3 className="font-headline font-bold text-primary mb-2">New to CommuniBid?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Membership to our exclusive charity auctions is by invitation or request only.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full rounded-xl py-6 font-bold border-primary text-primary hover:bg-primary/5">
                  <Mail className="mr-2" size={16} /> Contact Admin to Join
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border-none shadow-2xl rounded-3xl p-8">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-headline font-bold text-primary">Development Mode</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 bg-secondary/30 rounded-2xl border border-border">
                  <div className="p-4 bg-primary/10 rounded-full text-primary">
                    <Gavel size={32} />
                  </div>
                  <DialogDescription className="text-base text-foreground leading-relaxed">
                    This platform is currently in the development phase.
                    <br /><br />
                    To add new users, please log in with the <strong>Admin</strong> account and create user profiles directly from the User Management dashboard.
                  </DialogDescription>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
