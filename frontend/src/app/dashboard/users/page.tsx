"use client"

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, UserPlus, Shield, Mail } from 'lucide-react';
import { userService } from '@/lib/services/user-service';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'BIDDER'
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    password: '',
    role: 'BIDDER'
  });

  if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'ORGANIZER') return null;
  const isOrganizer = currentUser?.role === 'ORGANIZER';

  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await userService.getAllUsers(0, 50);
        setUsers(result.content);
      } catch (err) {
        console.error('Failed to load users', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    if (currentUser?.role === 'ADMIN') {
        loadUsers();
    } else {
        setLoadingUsers(false);
    }
  }, [currentUser]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.registerUser(formData);
      toast({ title: "User Created", description: `User ${formData.username} has been successfully registered.` });
      setOpen(false);
      // Optimistically add to list if ADMIN
      if (currentUser?.role === 'ADMIN') {
          setUsers([...users, { id: Date.now(), ...formData, role: formData.role === 'ROLE_BIDDER' || formData.role === 'BIDDER' ? 'ROLE_BIDDER' : formData.role }]);
      }
      setFormData({ username: '', password: '', role: 'BIDDER' });
    } catch (err: any) {
      toast({ title: "Registration Failed", description: err.message || "Failed to create user.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (u: any) => {
    setEditingUser(u);
    setEditFormData({ username: u.username, password: '', role: u.role.replace('ROLE_', '') });
    setEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    try {
      await userService.updateUser(editingUser.id, {
        ...editFormData,
        role: editFormData.role as 'ADMIN' | 'ORGANIZER' | 'BIDDER'
      });
      // Optimistically update
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, username: editFormData.username, role: `ROLE_${editFormData.role}` } : u));
      toast({ title: "User Updated", description: "Changes saved successfully." });
      setEditOpen(false);
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message || "Could not update user.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-primary">
            {isOrganizer ? 'Bidder Registration' : 'User Management'}
          </h1>
          <p className="text-muted-foreground">
            {isOrganizer ? 'Register new bidders for the platform.' : 'Manage roles and permissions for platform members.'}
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2 bg-primary font-bold">
              <UserPlus size={18} /> {isOrganizer ? 'Register Bidder' : 'Add Platform Member'}
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2rem]">
            <form onSubmit={handleInvite}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold">Register New User</DialogTitle>
                <DialogDescription>Add a new member to the CommuniBid ecosystem.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-8">
                <div className="space-y-2">
                  <Label className="font-bold">Username</Label>
                  <Input 
                    value={formData.username} 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    placeholder="johndoe" 
                    required 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Temporary Password</Label>
                  <Input 
                    type="password"
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    placeholder="••••••••" 
                    required 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Role</Label>
                  <Select 
                    onValueChange={(v) => setFormData({...formData, role: v})} 
                    defaultValue="BIDDER"
                    disabled={isOrganizer}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {!isOrganizer && <SelectItem value="ADMIN">Administrator</SelectItem>}
                      {!isOrganizer && <SelectItem value="ORGANIZER">Organizer</SelectItem>}
                      <SelectItem value="BIDDER">Bidder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading} className="rounded-full w-full bg-primary font-bold">
                  {loading ? "Registering..." : "Create Account"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {currentUser?.role === 'ADMIN' ? (
        <Card className="border-none shadow-sm overflow-hidden rounded-[2rem]">
            <CardContent className="p-0">
            <Table>
                <TableHeader className="bg-secondary/10">
                <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="font-bold py-6 px-8">Member</TableHead>
                    <TableHead className="font-bold py-6">Role</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loadingUsers ? (
                    <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground font-bold">Loading users...</TableCell>
                    </TableRow>
                ) : users.length > 0 ? users.map((u) => (
                    <TableRow key={u.id} className="group">
                    <TableCell className="px-8 py-4">
                        <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-md">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {u.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-primary">{u.username}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {u.username}@example.com
                            </p>
                        </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={u.role.includes('ADMIN') ? 'default' : u.role.includes('ORGANIZER') ? 'secondary' : 'outline'} className="rounded-full font-bold px-3 py-1">
                          {u.role.replace('ROLE_', '')}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openEdit(u)}>
                        <MoreHorizontal size={18} className="text-muted-foreground" />
                        </Button>
                    </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground font-bold">No users found.</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm overflow-hidden rounded-[2rem] bg-secondary/10 backdrop-blur-md">
            <CardContent className="p-8 text-center space-y-4">
            <Shield className="text-primary opacity-20 mx-auto" size={48} />
            <p className="text-muted-foreground text-sm">Authorized Administrative Access Only • CommuniBid Security Protocol</p>
            </CardContent>
        </Card>
      )}

      {/* Edit User Dialog - Kept for potential direct ID lookup if needed later */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditingUser(null); }}>
        <DialogContent className="rounded-[2rem]">
          {editingUser && (
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold">Manage Account: {editingUser.name}</DialogTitle>
                <DialogDescription>Modify permissions or reset credentials for this member.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-8">
                <div className="space-y-2">
                  <Label className="font-bold">Username</Label>
                  <Input 
                    value={editFormData.username} 
                    onChange={(e) => setEditFormData({...editFormData, username: e.target.value})} 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-destructive">Reset Password (Leave blank to keep current)</Label>
                  <Input 
                    type="password"
                    value={editFormData.password} 
                    onChange={(e) => setEditFormData({...editFormData, password: e.target.value})} 
                    placeholder="New Secure Password"
                    className="rounded-xl border-destructive/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Member Role</Label>
                  <Select onValueChange={(v) => setEditFormData({...editFormData, role: v})} defaultValue={editingUser.role}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                      <SelectItem value="ORGANIZER">Organizer</SelectItem>
                      <SelectItem value="BIDDER">Bidder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading} className="rounded-full w-full bg-primary font-bold shadow-lg shadow-primary/20">
                  {loading ? "Saving Changes..." : "Save Securely"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
