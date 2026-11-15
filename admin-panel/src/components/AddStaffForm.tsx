import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Superadmins give an existing account staff access (add_staff_member in the database).
// The person signs up on the admin sign-in page first, so they choose their own password.
const AddStaffForm: React.FC<{ onAdded: () => void }> = ({ onAdded }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase.rpc('add_staff_member', { p_email: email, p_role: role });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not add staff member', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Staff member added', description: `${data} is now ${role === 'superadmin' ? 'a superadmin' : `an ${role}`}.` });
    setEmail('');
    onAdded();
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2"><UserPlus className="h-5 w-5 text-realtor-gold" /> Add staff</CardTitle>
        <p className="text-sm text-gray-600">
          They first create an account on this admin site's sign-in page (Register tab), then you give that email access here.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
          <Input type="email" placeholder="Their email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1" />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">Editor: listings, images, inquiries</SelectItem>
              <SelectItem value="admin">Admin: everything except users</SelectItem>
              <SelectItem value="superadmin">Superadmin: everything</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={saving} className="bg-realtor-gold hover:bg-realtor-gold/90 text-white">
            {saving ? 'Adding…' : 'Add'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddStaffForm;
