import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Landing page for the password reset email. supabase-js reads the recovery token from the
// link and signs the user in for this one purpose; they then choose a new password here.
const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      // No token in the link (expired or opened twice)
      else setTimeout(() => setReady((r) => r ?? false), 1500);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: 'Password too short', description: 'Use at least 8 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", description: 'Please type the same password twice.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not change password', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Password changed', description: 'You are signed in with your new password.' });
    navigate('/admin');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Choose a new password</CardTitle>
          <CardDescription className="text-center">
            {ready === false ? 'This reset link has expired or was already used.' : 'Enter your new password twice.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ready === false ? (
            <Button className="w-full" onClick={() => navigate('/auth')}>Request a new link</Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-realtor-gold hover:bg-realtor-gold/90 text-white" disabled={!ready || saving}>
                {saving ? 'Saving...' : !ready ? 'Checking link...' : 'Save new password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPasswordPage;
