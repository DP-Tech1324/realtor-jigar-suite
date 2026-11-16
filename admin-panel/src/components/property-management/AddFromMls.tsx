import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { callSync } from './MlsFeedPanel';

// "Add from MLS®": type an MLS® number, one click, and the listing joins Jigar's list and the
// homepage Featured section (is_featured). Ontario listings are already stored by the sync, so
// most adds are instant; anything else is fetched from CREA once and saved.

export const normalizeMls = (value: string) => value.toUpperCase().replace(/MLS®?|#|\s/g, '');

export function AddFromMls({ onAdded, onEnterManually }: {
  onAdded: (listingId: string) => void;
  onEnterManually?: (mlsNumber: string) => void;
}) {
  const { toast } = useToast();
  const [mls, setMls] = useState('');
  const [adding, setAdding] = useState(false);
  const [notFound, setNotFound] = useState<string | null>(null);

  // Plain button + Enter key (not a <form>): this also sits inside the property form's MLS® tab
  const add = async () => {
    const number = normalizeMls(mls);
    if (!number) return;
    setAdding(true);
    setNotFound(null);
    try {
      const { data: found, error } = await supabase
        .from('listings')
        .select('id, address, city, is_featured, is_own_listing, source')
        .eq('mls_number', number)
        .maybeSingle();
      if (error) throw error;

      let id = found?.id as string | undefined;
      if (found && (found.is_featured || found.is_own_listing || found.source === 'manual')) {
        toast({ title: 'Already in your listings', description: `MLS® ${number}, ${found.address}` });
        onAdded(found.id);
        return;
      }
      if (!id) {
        // Not stored yet (brand new, or outside Ontario): fetch it from CREA and save it
        try {
          id = (await callSync({ import_mls: number })).id;
        } catch (err: any) {
          if (/not on CREA|missing its address/i.test(err.message)) throw err;
          // CREA can't be reached (no access yet, or running on localhost): explain and offer manual entry
          setNotFound(number);
          return;
        }
      }

      const { error: featureError } = await supabase.from('listings').update({ is_featured: true }).eq('id', id!);
      if (featureError) throw featureError;
      toast({ title: 'Property added', description: `MLS® ${number} is in your listings and featured on the homepage.` });
      setMls('');
      onAdded(id!);
    } catch (err: any) {
      toast({ title: 'Could not add property', description: err.message, variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="sm:w-56 shrink-0">
            <div className="font-semibold text-realtor-navy">Add from MLS®</div>
            <div className="text-xs text-gray-500">Adds it to your listings and the homepage</div>
          </div>
          <Input
            id="add-mls-number"
            placeholder="MLS® number, e.g. W14079974"
            value={mls}
            onChange={(e) => setMls(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (!adding) add();
              }
            }}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="button" onClick={add} disabled={adding || !mls.trim()} className="bg-realtor-gold hover:bg-realtor-gold/90">
            {adding ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            {adding ? 'Adding…' : 'Add property'}
          </Button>
        </div>
        {notFound && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="flex-1">
              MLS® {notFound} isn't in the stored listings yet. Listings newer than the last MLS® sync arrive once the
              sync and CREA access are back on. You can add it now by entering the details yourself.
            </p>
            {onEnterManually && (
              <Button type="button" variant="outline" size="sm" onClick={() => onEnterManually(notFound)}>
                Enter it by hand
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
