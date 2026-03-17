"use client"

import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navbar';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
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
import { 
  LayoutDashboard, 
  Gavel, 
  Users, 
  PlusCircle, 
  Settings, 
  History, 
  Menu,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const menuItems = {
    ADMIN: [
      { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
      { icon: Gavel, label: 'Items Management', href: '/dashboard/items' },
      { icon: Users, label: 'User Management', href: '/dashboard/users' },
    ],
    ORGANIZER: [
      { icon: LayoutDashboard, label: 'Performance', href: '/dashboard' },
      { icon: Gavel, label: 'Items Management', href: '/dashboard/items' },
      { icon: Users, label: 'Add Bidder', href: '/dashboard/users' },
    ],
    BIDDER: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Gavel, label: 'Auction Gallery', href: '/dashboard/items' },
      { icon: History, label: 'Bidding History', href: '/dashboard/history' },
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SidebarProvider>
        <div className="flex flex-1 w-full pt-20">
          <Sidebar variant="inset" className="top-20 h-[calc(100vh-5rem)] border-r border-border/50 bg-background/50 backdrop-blur-xl">
            <SidebarHeader className="px-6 py-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20 p-0.5">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-headline font-bold text-primary truncate max-w-[120px]">{user.username}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mt-0.5">{user.role}</span>
                  </div>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="px-3">
              <SidebarNavigation userRole={user.role as keyof typeof menuItems} menuItems={menuItems} />
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto">
              <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-primary/60">Session Status</span>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 p-0 h-auto hover:bg-transparent text-destructive hover:text-destructive/80 font-bold text-sm"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-headline font-bold">Sign Out</AlertDialogTitle>
                      <AlertDialogDescription className="text-base">
                        Are you sure you want to sign out of your CommuniBid session?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-4">
                      <AlertDialogCancel className="rounded-full px-8 font-bold border-2">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={logout}
                        className="rounded-full px-8 font-bold bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20"
                      >
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <SidebarInset className="w-full bg-secondary/10">
            {/* Mobile Header */}
            <header className="flex h-20 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md px-6 md:hidden sticky top-20 z-40">
              <SidebarTrigger className="-ml-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Menu className="h-5 w-5" />
                </div>
              </SidebarTrigger>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <div className="flex flex-col">
                <span className="font-headline font-bold text-primary text-sm tracking-tight">Dashboard</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-accent">Navigation</span>
              </div>
            </header>
            
            <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full min-h-full">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

import { useSidebar } from '@/components/ui/sidebar';

function SidebarNavigation({ userRole, menuItems }: { userRole: string, menuItems: any }) {
  const { setOpenMobile, isMobile } = useSidebar();
  const currentMenu = menuItems[userRole] || [];

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu>
      <div className="px-3 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Main Menu</span>
      </div>
      {currentMenu.map((item: any) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton 
            asChild 
            className="py-6 px-4 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group border border-transparent hover:border-primary/10"
          >
            <Link 
              href={item.href} 
              className="flex items-center justify-between w-full"
              onClick={handleLinkClick}
            >
              <div className="flex items-center gap-4">
                <item.icon className="text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-110" size={18} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      
      <div className="px-3 mt-8 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Preferences</span>
      </div>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild
          className="py-6 px-4 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group border border-transparent hover:border-primary/10"
        >
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-4"
            onClick={handleLinkClick}
          >
            <Settings className="text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all" size={18} />
            <span className="font-bold text-sm tracking-tight">Account Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
