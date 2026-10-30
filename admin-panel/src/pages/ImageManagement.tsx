import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
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
} from '@/components/ui/alert-dialog';
import { Upload, Image as ImageIcon, Trash2, Search, Copy, Loader, Link2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'realtorjigar-images';
const FOLDER = 'property-images';

interface StoredImage {
  path: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
  usedBy: string[];
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// Photo library backed by Supabase Storage; shows which listings use each photo
const ImageManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [files, listings] = await Promise.all([
      supabase.storage.from(BUCKET).list(FOLDER, { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } }),
      supabase.from('listings').select('title, images, cover_image'),
    ]);
    if (files.error) {
      toast({ title: 'Error loading images', description: files.error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const usage = new Map<string, string[]>();
    (listings.data || []).forEach((l) => {
      [l.cover_image, ...(l.images || [])].filter(Boolean).forEach((url: string) => {
        const name = url.split('/').pop()!;
        usage.set(name, [...new Set([...(usage.get(name) || []), l.title])]);
      });
    });

    setImages(
      (files.data || [])
        .filter((f) => f.id) // skip folder placeholders
        .map((f) => {
          const path = `${FOLDER}/${f.name}`;
          return {
            path,
            name: f.name,
            url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
            size: (f.metadata as any)?.size || 0,
            createdAt: f.created_at || '',
            usedBy: usage.get(f.name) || [],
          };
        }),
    );
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type) && f.size <= 10 * 1024 * 1024);
    if (list.length === 0) {
      toast({ title: 'Nothing to upload', description: 'Use JPG, PNG or WEBP files up to 10 MB.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    let failed = 0;
    for (const file of list) {
      const ext = file.name.split('.').pop();
      const path = `${FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '3600' });
      if (error) failed++;
    }
    setUploading(false);
    toast({
      title: failed ? `${list.length - failed} uploaded, ${failed} failed` : `${list.length} image${list.length > 1 ? 's' : ''} uploaded`,
      variant: failed ? 'destructive' : 'default',
    });
    load();
  };

  const remove = async (image: StoredImage) => {
    const { error } = await supabase.storage.from(BUCKET).remove([image.path]);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
      return;
    }
    setImages((prev) => prev.filter((i) => i.path !== image.path));
    toast({ title: 'Image deleted' });
  };

  const filteredImages = images.filter((image) => {
    const term = searchTerm.toLowerCase();
    return image.name.toLowerCase().includes(term) || image.usedBy.some((t) => t.toLowerCase().includes(term));
  });
  const totalSize = images.reduce((sum, image) => sum + image.size, 0);
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonth = images.filter((i) => i.createdAt && new Date(i.createdAt) >= monthStart).length;
  const unused = images.filter((i) => i.usedBy.length === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-realtor-navy">Image Management</h1>
        <p className="text-gray-600 mt-2">Upload and manage property images and media</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Images', value: images.length, Icon: ImageIcon, color: 'text-blue-500' },
          { label: 'Storage Used', value: formatSize(totalSize), Icon: Upload, color: 'text-green-500' },
          { label: 'Not Used by a Listing', value: unused, Icon: Link2, color: 'text-realtor-gold' },
          { label: 'This Month', value: thisMonth, Icon: Upload, color: 'text-purple-500' },
        ].map(({ label, value, Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Icon className={`h-8 w-8 ${color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className="text-2xl font-bold">{loading ? '–' : value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragging ? 'border-realtor-gold bg-amber-50' : 'border-gray-300 hover:border-realtor-gold'}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
          >
            {uploading ? <Loader className="mx-auto h-12 w-12 text-gray-400 animate-spin" /> : <Upload className="mx-auto h-12 w-12 text-gray-400" />}
            <p className="mt-2 text-sm text-gray-600">
              {uploading ? 'Uploading…' : <>Drag and drop files here, or{' '}
                <Button variant="link" className="p-0 h-auto text-realtor-gold" onClick={() => fileInput.current?.click()}>
                  browse
                </Button>{' '}
                to select files</>}
            </p>
            <p className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, WEBP up to 10MB each</p>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => { if (e.target.files) upload(e.target.files); e.target.value = ''; }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle>Image Library</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by file or listing..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500">Loading images…</p>
          ) : filteredImages.length === 0 ? (
            <p className="text-sm text-gray-500">No images yet. Upload some above or add photos to a property.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div key={image.path} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={image.url} alt={image.usedBy[0] || image.name} loading="lazy" className="aspect-video w-full object-cover bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-gray-600 line-clamp-2" title={image.usedBy.join(', ')}>
                      {image.usedBy.length ? `Used by: ${image.usedBy.join(', ')}` : 'Not used by any listing'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatSize(image.size)}{image.createdAt ? ` · ${new Date(image.createdAt).toLocaleDateString('en-CA')}` : ''}
                      </span>
                      <div className="flex">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label="Copy image link"
                          onClick={() => { navigator.clipboard.writeText(image.url); toast({ title: 'Link copied' }); }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700" aria-label="Delete image">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this image?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {image.usedBy.length
                                  ? `It is used by ${image.usedBy.join(', ')}. Those listings will show a broken photo.`
                                  : 'It is not used by any listing.'}{' '}
                                This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(image)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageManagement;
