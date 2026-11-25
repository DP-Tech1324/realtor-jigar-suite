import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Maximize,
  X,
  Calculator,
  Printer,
} from "lucide-react";
import ListingFacts, { type Fact } from "@/components/ListingFacts";
import { useListing, listingImages, isLiveListingId } from "@/hooks/useListings";
import { supabase } from "@/integrations/supabase/client";
import VastuSection from "@/components/VastuSection";
import VastuCheck from "@/components/VastuCheck";
import { DdfDetailCredit, isDdf } from "@/components/DdfAttribution";
import { formatListingPrice, isRental } from "@/lib/price";
import { parseVastu } from "@/lib/vastu";
import { useIsFavorite, useToggleFavorite } from "@/hooks/useFavorites";
import { useAuth } from "@/components/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import InquiryForm from "@/components/InquiryForm";
import type { InquiryType } from "@/lib/inquiries";
import { useNavigate } from "react-router-dom";

// Import the shared AI chat bubble wrapper. This component renders a floating
// chat interface using the shared base and client context. Injecting it here
// allows visitors to ask questions about the property or the platform without
// leaving the page.
import AiChatBubble from '@/components/AiChatBubble';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: listing, isLoading, error } = useListing(id || "");
  const { data: isFavorite } = useIsFavorite(id || "");
  const toggleFavorite = useToggleFavorite();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState<string | undefined>();
  const [contactTitle, setContactTitle] = useState('Contact Jigar');
  const [contactType, setContactType] = useState<InquiryType>('info');

  // Count one view per page load for the admin dashboard
  useEffect(() => {
    if (id && !isLiveListingId(id)) supabase.from('listing_views').insert({ listing_id: id }).then(() => {});
  }, [id]);

  // Use the SEO fields from the admin panel for the browser title and meta description
  useEffect(() => {
    if (!listing) return;
    const previousTitle = document.title;
    document.title = listing.seo_title || `${listing.title} | Jigar Patel Real Estate`;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content');
    if (meta && (listing.seo_description || listing.description)) {
      meta.setAttribute('content', listing.seo_description || listing.description!.slice(0, 155));
    }
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription != null) meta.setAttribute('content', previousDescription);
    };
  }, [listing]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-64 md:h-96 w-full mb-8 rounded-3xl" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Property Not Found</h1>
            <p className="text-slate-600 mb-8">
              The property you're looking for doesn't exist, has been removed, or the URL is incorrect.
            </p>
            <div className="space-y-4">
              <Button onClick={() => navigate('/search')} className="w-full">
                Browse All Properties
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const gallery = listingImages(listing);
  const images = gallery.length ? gallery : ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80'];
  const vastu = parseVastu(listing.vastu);
  const showVastu = !!vastu?.enabled && listing.vastu_score != null;

  const openContact = (message?: string, title = 'Contact Jigar', type: InquiryType = 'info') => {
    setContactMessage(message);
    setContactTitle(title);
    setContactType(type);
    setShowContactForm(true);
  };
  

  const handleFavoriteClick = () => {
    if (!user || !id) return;
    toggleFavorite.mutate(id);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this property: ${listing.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const cityName = listing.city?.split('(')[0].trim();
  const neighbourhood = listing.city?.match(/\(([^)]+)\)/)?.[1];
  const summaryLine = [
    listing.bedrooms ? `${listing.bedrooms} Beds` : null,
    listing.bathrooms ? `${listing.bathrooms} Baths` : null,
    listing.square_footage ? `${listing.square_footage.toLocaleString()} sqft` : null,
  ].filter(Boolean).join(' · ');

  const features = [
    { icon: Bed, label: 'Bedrooms', value: listing.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: listing.bathrooms },
    { icon: Square, label: 'Square Feet', value: listing.square_footage },
    { icon: Calendar, label: 'Year Built', value: listing.year_built },
  ].filter(feature => feature.value);

  // What we hold for every listing; MLS® listings add CREA's full record (ListingFacts)
  const basicFacts: Fact[] = [
    { label: 'Property type', value: listing.property_type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
    { label: 'Bedrooms', value: listing.bedrooms },
    { label: 'Bathrooms', value: listing.bathrooms },
    { label: 'Interior size', value: listing.square_footage ? `${listing.square_footage.toLocaleString()} sqft` : null },
    { label: 'Lot size', value: listing.lot_size ? `${listing.lot_size.toLocaleString()} sqft` : null },
    { label: 'Year built', value: listing.year_built },
    { label: 'Neighbourhood', value: neighbourhood },
    { label: 'MLS® number', value: listing.mls_number },
  ].filter((f) => f.value != null && f.value !== '').map((f) => ({ label: f.label, value: String(f.value) }));

  const listingName = listing.mls_number ? `${listing.address}, ${cityName} (MLS® ${listing.mls_number})` : `${listing.address}, ${cityName}`;
  const bookShowing = () => openContact(`Hi Jigar, I'd like to book a showing of ${listingName}.`, 'Book a Showing', 'showing');
  const requestInfo = () => openContact(`Hi Jigar, please send me more information about ${listingName}.`, 'Request Information', 'info');

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200 py-3 print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-blue-600">Listings</Link>
            {cityName && (
              <>
                <span>/</span>
                <Link to={`/listings?location=${encodeURIComponent(cityName)}`} className="hover:text-blue-600">{cityName}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-slate-900 font-medium">{listing.address}</span>
          </nav>
        </div>
      </div>

      {/* Title: address, MLS®, price and actions */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-blue-600 text-white">
                {listing.property_type.replace('_', ' ').toUpperCase()}
              </Badge>
              {isRental(listing) && listing.status !== 'sold' && <Badge className="bg-emerald-600 text-white">FOR RENT</Badge>}
              {listing.is_own_listing && <Badge className="bg-slate-900 text-white">JIGAR'S LISTING</Badge>}
              {listing.status === 'pending' && <Badge className="bg-amber-500 text-white">PENDING</Badge>}
              {listing.status === 'sold' && <Badge className="bg-slate-700 text-white">{listing.transaction_type === 'rent' ? 'LEASED' : 'SOLD'}</Badge>}
              {showVastu && (
                <a href="#vastu">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-300">
                    {listing.facing ? `${listing.facing}-facing · ` : ''}Vastu {listing.vastu_score}/10
                  </Badge>
                </a>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900">{listing.address}</h1>
            <div className="flex items-center text-slate-600 mt-2">
              <MapPin className="h-5 w-5 mr-2 text-blue-600 shrink-0" />
              <span className="text-lg">{[listing.city, listing.province, listing.postal_code].filter(Boolean).join(', ')}</span>
            </div>
            {listing.mls_number && <div className="text-sm text-slate-500 mt-1">MLS® # {listing.mls_number}</div>}
          </div>
          <div className="md:text-right">
            <div className="text-3xl md:text-4xl font-bold text-slate-900">{formatListingPrice(listing)}</div>
            {summaryLine && <div className="text-slate-600 mt-1">{summaryLine}</div>}
            <div className="flex md:justify-end gap-2 mt-3 print:hidden">
              {user && !listing.live && (
                <Button variant="outline" size="sm" onClick={handleFavoriteClick}>
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                  <span className="ml-2">{isFavorite ? 'Saved' : 'Save'}</span>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                <span className="ml-2">Share</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                <span className="ml-2">Print</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="h-64 md:h-96 lg:h-[520px] relative overflow-hidden bg-slate-100 rounded-2xl">
          <img
            src={images[currentImageIndex]}
            alt={`${listing.address}, photo ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors print:hidden"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors print:hidden"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
            <span className="font-medium">{currentImageIndex + 1} / {images.length}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm print:hidden"
            onClick={() => setShowFullscreen(true)}
          >
            <Maximize className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Expand</span>
          </Button>
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto py-3 print:hidden">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setCurrentImageIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 ${i === currentImageIndex ? 'border-blue-600' : 'border-transparent opacity-80 hover:opacity-100'}`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Calls to action under the photos */}
        <div className="flex flex-wrap gap-3 py-4 print:hidden">
          <Button onClick={bookShowing} className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-4 w-4 mr-2" /> Book a Showing
          </Button>
          <Button variant="outline" onClick={requestInfo}>
            <Mail className="h-4 w-4 mr-2" /> Request Information
          </Button>
          <Button asChild variant="outline">
            <a href="tel:+16478015448"><Phone className="h-4 w-4 mr-2" /> (647) 801-5448</a>
          </Button>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Features */}
              {features.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-slate-50 rounded-2xl p-5 text-center">
                      <feature.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {typeof feature.value === 'number' ? feature.value.toLocaleString() : feature.value}
                      </div>
                      <div className="text-sm text-slate-600">{feature.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">About This Property</h2>
                <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description || `Contact Jigar Patel for full details on ${listing.address}, ${cityName}.`}
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Property Details</h2>
                <ListingFacts listing={listing} basic={basicFacts} />
              </div>

              <Separator />
              {showVastu ? (
                <VastuSection
                  vastu={listing.vastu}
                  facing={listing.facing}
                  onAsk={() => openContact(`Hi Jigar, I have a Vastu question about "${listing.title}": `, 'Vastu Question', 'vastu')}
                />
              ) : (
                // MLS® listings without Jigar's details: AI estimate from the floor plan, or a report request
                <VastuCheck
                  listingId={listing.id}
                  propertyType={listing.property_type}
                  province={listing.province}
                  live={listing.live}
                  onRequest={() => openContact(
                    `Hi Jigar, please prepare a Vastu report for "${listing.title}"${listing.mls_number ? ` (MLS® ${listing.mls_number})` : ''}, ${listing.address}, ${listing.city}.`,
                    'Request a Vastu Report',
                    'vastu',
                  )}
                />
              )}

              {listing.province && listing.province !== 'ON' && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-slate-800">
                  <div className="font-semibold text-slate-900 mb-1">Buying outside Ontario?</div>
                  <p className="text-sm">
                    Jigar will connect you with a trusted local REALTOR® in {listing.city} and stay with you through the purchase.
                    Use "Book a Showing" or call to get started.
                  </p>
                </div>
              )}

              <DdfDetailCredit listing={listing} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Agent Contact Card */}
              <Card className="sticky top-24 shadow-xl animate-fade-in">
                <CardContent className="p-6 md:p-8">
                  <div className="flex justify-center mb-4">
    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold rounded-full px-4 py-1 shadow-sm border border-blue-200 uppercase tracking-wider">
      {isDdf(listing) && !listing.is_own_listing ? 'Ask Jigar About This Home' : 'Presented by Jigar Patel'}
    </span>
  </div>
                  <div className="text-center mb-8">
                    <img
                         src="/images/agents/IMG_9799.JPG"  // or your agent's photo path
                          alt="Jigar Patel"
                          className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-lg border-2 border-blue-600"
                         />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Jigar Patel</h3>
                    <p className="text-slate-600 mb-2">Licensed Real Estate Professional</p>
                    <p className="text-sm text-slate-500 mb-4">Royal LePage Terra Realty, Brokerage</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center">
                      <Phone className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="font-medium">(647) 801-5448</span>
                      <span className="text-sm text-slate-500 ml-2">mobile</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Phone className="h-5 w-5 mr-3 text-blue-600" />
                      <a href="tel:+19059554500" className="font-medium">(905) 955-4500</a>
                      <span className="text-sm text-slate-500 ml-2">direct</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Mail className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="text-sm">jigarpatel@royallepage.ca</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                      <a href="tel:+16478015448">
                        <Phone className="h-5 w-5 mr-2" />
                        Call Now
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full text-lg py-3">
                      <a href={`mailto:jigarpatel@royallepage.ca?subject=${encodeURIComponent(`Inquiry: ${listing.title}`)}&body=${encodeURIComponent(`Hi Jigar,\n\nI'm interested in ${listing.title} (${window.location.href}).\n\n`)}`}>
                        <Mail className="h-5 w-5 mr-2" />
                        Send Email
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-lg py-3"
                      onClick={bookShowing}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book a Showing
                    </Button>
                  </div>

                </CardContent>
              </Card>

              {/* Mortgage Calculator Card */}
              {!isRental(listing) && <Card className="shadow-lg animate-fade-in print:hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                    Mortgage Calculator
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Estimate your monthly payments for this property
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/calculators/mortgage')}
                  >
                    Calculate Payments
                  </Button>
                </CardContent>
              </Card>}

              {/* Property Download */}
             {/* <Card className="shadow-lg animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <Download className="h-5 w-5 mr-2 text-blue-600" />
                    Property Information
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Download detailed property brochure and fact sheet
                  </p>
                  <Button variant="outline" className="w-full">
                    Download PDF
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </section>

      {/* Full-screen photos */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Photos"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowFullscreen(false);
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
          }}
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          <img src={images[currentImageIndex]} alt={`${listing.address}, photo ${currentImageIndex + 1}`} className="max-h-full max-w-full object-contain" />
          <button onClick={() => setShowFullscreen(false)} aria-label="Close photos" className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full">
            <X className="h-6 w-6" />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={prevImage} aria-label="Previous photo" className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full">
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button onClick={nextImage} aria-label="Next photo" className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full">
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm">{currentImageIndex + 1} / {images.length}</div>
        </div>
      )}

      {/* Sticky bar on phones: price and the two main actions always in reach */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] print:hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 truncate">{formatListingPrice(listing)}</div>
            <div className="text-xs text-slate-500 truncate">{listing.address}</div>
          </div>
          <Button size="sm" variant="outline" onClick={requestInfo}>Info</Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={bookShowing}>Book a Showing</Button>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">{contactTitle}</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowContactForm(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <InquiryForm
                listingId={listing.live ? undefined : listing.id}
                listingTitle={listing.mls_number ? `${listing.title} (MLS® ${listing.mls_number})` : listing.title}
                initialMessage={contactMessage}
                inquiryType={contactType}
                title={contactType === 'showing' ? 'Pick a time that works for you' : undefined}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
      {/* AI assistant bubble anchored to the bottom‑right of the page */}
      <AiChatBubble />
    </div>
  );
};

export default PropertyDetails;
