
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Property, PROPERTY_TYPE_LABELS, PropertyType } from '@/types/Property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUploader } from './ImageUploader';
import { Loader, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { VastuEditor } from './VastuEditor';
import { callAI } from '@/lib/ai';
import { emptyVastu, evaluateVastu, type Direction, type VastuData } from '@/lib/vastu';

interface PropertyFormProps {
  onSubmit: (formData: Partial<Property>, coverImage?: File, additionalImages?: string[]) => Promise<void>;
  initialData?: Partial<Property>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

// Define validation schema with zod
const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  price: z.coerce.number().positive("Price must be a positive number").min(1, "Price is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  province: z.string().min(2, "Province is required"),
  bedrooms: z.coerce.number().int().nonnegative("Bedrooms must be a non-negative number"),
  bathrooms: z.coerce.number().nonnegative("Bathrooms must be a non-negative number"),
  square_feet: z.coerce.number().nonnegative("Square footage must be a non-negative number"),
  lot_size: z.coerce.number().nonnegative().optional(),
  year_built: z.coerce.number().int().min(0).max(2100).optional(),
  postal_code: z.string().max(10).optional(),
  property_type: z.enum(['single_family', 'condo', 'townhouse', 'multi_family', 'land', 'commercial']),
  transaction_type: z.enum(['sale', 'rent']),
  market_status: z.enum(['for-sale', 'pending', 'sold']),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  status: z.enum(['published', 'draft']),
  featured: z.boolean(),
  mls_number: z.string().optional(),
  seo_title: z.string().max(70, "SEO title should be under 70 characters").optional(),
  seo_description: z.string().max(160, "SEO description should be under 160 characters").optional(),
  meta_keywords: z.string().max(200, "Meta keywords should be under 200 characters").optional(),
  virtual_tour_url: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export function PropertyForm({ onSubmit, initialData, isSubmitting, onCancel }: PropertyFormProps) {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>(initialData?.images || []);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [vastu, setVastu] = useState<VastuData>(initialData?.vastu ?? emptyVastu());
  const [facing, setFacing] = useState<Direction | null>(initialData?.facing ?? null);
  const [aiBusy, setAiBusy] = useState<'describe' | 'seo' | null>(null);
  const { toast } = useToast();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || '',
      price: initialData?.price || 0,
      city: initialData?.city || '',
      address: initialData?.address || '',
      province: initialData?.province || 'ON',
      bedrooms: initialData?.bedrooms || 1,
      bathrooms: initialData?.bathrooms || 1,
      square_feet: initialData?.square_feet || 0,
      lot_size: initialData?.lot_size || undefined,
      year_built: initialData?.year_built || undefined,
      postal_code: initialData?.postal_code || '',
      property_type: (initialData?.property_type as PropertyType) || 'single_family',
      transaction_type: initialData?.transaction_type || 'sale',
      market_status: initialData?.market_status || 'for-sale',
      description: initialData?.description || '',
      status: (initialData?.status as 'published' | 'draft') || 'draft',
      featured: initialData?.featured || false,
      mls_number: initialData?.mls_number || '',
      seo_title: initialData?.seo_title || '',
      seo_description: initialData?.seo_description || '',
      meta_keywords: initialData?.meta_keywords || '',
      virtual_tour_url: initialData?.virtual_tour_url || '',
    },
  });

  const handleFormSubmit = async (data: PropertyFormValues) => {
    await onSubmit({ ...data, vastu, facing } as Partial<Property>, coverImage || undefined, additionalImages);
  };

  // Jump to the tab holding the first invalid field, since hidden tabs hide their errors
  const handleInvalid = (errors: Record<string, unknown>) => {
    const seoFields = ['seo_title', 'seo_description', 'meta_keywords', 'virtual_tour_url'];
    const first = Object.keys(errors)[0];
    if (first === 'mls_number') setActiveTab('mls');
    else if (seoFields.includes(first)) setActiveTab('seo');
    else setActiveTab('basic');
  };

  // Current form state in the shape api/ai.js expects
  const listingForAI = () => {
    const values = form.getValues();
    const { checks, score } = vastu.enabled ? evaluateVastu(vastu, facing) : { checks: [], score: null };
    return {
      ...values,
      facing: vastu.enabled ? facing : undefined,
      vastu_score: score ?? undefined,
      vastu_checks: checks.length ? checks.map((c) => `${c.label}: ${c.value} (${c.verdict.replace('_', ' ')})`) : undefined,
    };
  };

  const runAI = async (action: 'describe' | 'seo') => {
    setAiBusy(action);
    try {
      if (action === 'describe') {
        const { description } = await callAI<{ description: string }>('describe', { listing: listingForAI() });
        form.setValue('description', description.slice(0, 2000), { shouldValidate: true, shouldDirty: true });
      } else {
        const seo = await callAI<{ seo_title: string; seo_description: string; meta_keywords: string }>('seo', { listing: listingForAI() });
        form.setValue('seo_title', seo.seo_title.slice(0, 70), { shouldValidate: true, shouldDirty: true });
        form.setValue('seo_description', seo.seo_description.slice(0, 160), { shouldValidate: true, shouldDirty: true });
        form.setValue('meta_keywords', seo.meta_keywords.slice(0, 200), { shouldValidate: true, shouldDirty: true });
      }
      toast({ title: action === 'describe' ? 'Description written' : 'SEO fields filled', description: 'Review and edit before saving.' });
    } catch (e: any) {
      toast({ title: 'AI request failed', description: e.message, variant: 'destructive' });
    } finally {
      setAiBusy(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Property' : 'Add New Property'}</CardTitle>
        <CardDescription>Fill out the form to {initialData ? 'update' : 'create'} a property listing.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit, handleInvalid)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="vastu">Vastu</TabsTrigger>
                <TabsTrigger value="mls">MLS Integration</TabsTrigger>
                <TabsTrigger value="seo">SEO & Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="vastu" className="pt-4">
                <VastuEditor vastu={vastu} facing={facing} onChange={setVastu} onFacingChange={setFacing} />
              </TabsContent>

              <TabsContent value="mls" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="mls_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MLS Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter MLS number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter an MLS number to import details from Royal LePage
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border rounded-lg p-4 mt-4">
                  <h3 className="text-lg font-medium mb-2">Royal LePage Integration</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    View real-time data from Royal LePage using the iframe below. This integration allows you to easily
                    reference listing details directly from their system.
                  </p>
                  <div className="border rounded bg-gray-50 p-2">
                    <iframe
                      src="https://www.royallepage.ca/en/search/homes/on/toronto/"
                      className="w-full min-h-[500px] border-none"
                      title="Royal LePage Property Listings"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="basic" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Property title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Property price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="City name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ON">Ontario</SelectItem>
                              <SelectItem value="BC">British Columbia</SelectItem>
                              <SelectItem value="AB">Alberta</SelectItem>
                              <SelectItem value="QC">Quebec</SelectItem>
                              <SelectItem value="MB">Manitoba</SelectItem>
                              <SelectItem value="SK">Saskatchewan</SelectItem>
                              <SelectItem value="NS">Nova Scotia</SelectItem>
                              <SelectItem value="NB">New Brunswick</SelectItem>
                              <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                              <SelectItem value="PE">Prince Edward Island</SelectItem>
                              <SelectItem value="NT">Northwest Territories</SelectItem>
                              <SelectItem value="NU">Nunavut</SelectItem>
                              <SelectItem value="YT">Yukon</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="property_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((t) => (
                                <SelectItem key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="square_feet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Square Feet</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lot_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lot Size (sq ft)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year_built"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Built</FormLabel>
                        <FormControl>
                          <Input type="number" min="1800" max="2100" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="L6Y 1A1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transaction_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listed For</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sale">Sale</SelectItem>
                              <SelectItem value="rent">Rent / Lease</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="market_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Status</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="for-sale">Available</SelectItem>
                              <SelectItem value="pending">Pending / Conditionally sold</SelectItem>
                              <SelectItem value="sold">Sold / Leased</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Published properties will be visible to everyone.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-2">
                        <FormLabel>Description</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={() => runAI('describe')} disabled={aiBusy !== null}>
                          {aiBusy === 'describe' ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-realtor-gold" />}
                          Write with AI
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea rows={4} placeholder="Detailed description of the property" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image</Label>
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    />
                    {coverImage && <p className="text-sm text-gray-500">Selected: {coverImage.name}</p>}
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Label>Property Gallery</Label>
                    <ImageUploader
                      initialImages={additionalImages}
                      onImagesChange={setAdditionalImages}
                      maxImages={8}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Property</FormLabel>
                        <FormDescription>
                          Featured properties appear at the top of listings.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="seo" className="space-y-6 pt-4">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed p-4">
                  <p className="text-sm text-gray-600">Fill the SEO title, description and keywords from this listing (adds Vastu keywords when set).</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => runAI('seo')} disabled={aiBusy !== null}>
                    {aiBusy === 'seo' ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-realtor-gold" />}
                    Generate SEO
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="virtual_tour_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Virtual Tour URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Link to a 3D virtual tour (if available).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title for search engines" {...field} />
                      </FormControl>
                      <FormDescription>
                        Keep under 70 characters for best results. Will default to property title if left blank.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description for search engines" {...field} />
                      </FormControl>
                      <FormDescription>
                        Keep under 160 characters for best results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="Keywords separated by commas" {...field} />
                      </FormControl>
                      <FormDescription>
                        Keywords for search engines, separated by commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="bg-realtor-navy hover:bg-realtor-navy/90">
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Property' : 'Create Property')}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
