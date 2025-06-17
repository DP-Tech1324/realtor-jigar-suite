
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
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
  Car, 
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Maximize,
  X,
  Download,
  Calculator,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { useListing } from "@/hooks/useListings";
import { useIsFavorite, useToggleFavorite } from "@/hooks/useFavorites";
import { useAuth } from "@/components/auth/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import InquiryForm from "@/components/InquiryForm";
import { useNavigate } from "react-router-dom";

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
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
        <Header />
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

  const images = listing.images || ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80'];
  
  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(price);
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

  const features = [
    { icon: Bed, label: 'Bedrooms', value: listing.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: listing.bathrooms },
    { icon: Square, label: 'Square Feet', value: listing.square_footage },
    { icon: Calendar, label: 'Year Built', value: listing.year_built },
  ].filter(feature => feature.value);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/search" className="hover:text-blue-600">Search</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Property Details</span>
          </div>
        </div>
      </div>
      
      {/* Image Gallery */}
      <section className="relative">
        <div className="h-64 md:h-96 lg:h-[500px] relative overflow-hidden bg-slate-100">
          <img 
            src={images[currentImageIndex]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          
          {/* Image Controls */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          
          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
            <span className="font-medium">{currentImageIndex + 1} / {images.length}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 hover:bg-white backdrop-blur-sm"
                onClick={handleFavoriteClick}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                <span className="ml-2 hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white backdrop-blur-sm"
              onClick={() => setShowFullscreen(true)}
            >
              <Maximize className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Expand</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white backdrop-blur-sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Share</span>
            </Button>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg">
              <div className="text-2xl md:text-3xl font-bold">
                {formatPrice(listing.price)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <Badge className="bg-blue-600 text-white mb-3">
                      {listing.property_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3">
                      {listing.title}
                    </h1>
                    <div className="flex items-center text-slate-600 mb-4">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-lg">{listing.address}, {listing.city}, {listing.province}</span>
                    </div>
                  </div>
                </div>
                
                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-slate-50 rounded-2xl p-6 text-center">
                      <feature.icon className="h-6 w-6 text-blue-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {typeof feature.value === 'number' ? feature.value.toLocaleString() : feature.value}
                      </div>
                      <div className="text-sm text-slate-600">{feature.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Property Description</h2>
                <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                  <p>
                    {listing.description || `This exceptional ${listing.property_type.replace('_', ' ')} property offers modern living in one of the GTA's most desirable locations. With ${listing.bedrooms} bedrooms and ${listing.bathrooms} bathrooms across ${listing.square_footage} square feet, this home provides comfortable living space for the whole family.`}
                  </p>
                  <p>
                    Located in the heart of {listing.city}, you'll enjoy easy access to top-rated schools, shopping centers, public transportation, and recreational facilities. This property represents an excellent opportunity for both families and investors looking for quality real estate in the Greater Toronto Area.
                  </p>
                  <p>
                    Contact Jigar Patel today to schedule a private viewing and discover everything this property has to offer. With extensive knowledge of the local market and a commitment to client satisfaction, Jigar will guide you through every step of the buying process.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Property Details */}
              <div className="animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Property Details</h2>
                <div className="bg-slate-50 rounded-2xl p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: 'Property Type', value: listing.property_type.replace('_', ' ').toUpperCase() },
                      { label: 'Bedrooms', value: listing.bedrooms },
                      { label: 'Bathrooms', value: listing.bathrooms },
                      { label: 'Square Footage', value: listing.square_footage ? `${listing.square_footage.toLocaleString()} sqft` : 'N/A' },
                      { label: 'Year Built', value: listing.year_built || 'N/A' },
                      { label: 'Lot Size', value: listing.lot_size ? `${listing.lot_size.toLocaleString()} sqft` : 'N/A' },
                      { label: 'MLS Number', value: listing.mls_number || 'Contact for details' },
                      { label: 'City', value: listing.city },
                      { label: 'Province', value: listing.province },
                      { label: 'Postal Code', value: 'Contact for details' },
                    ].map((detail, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-b-0">
                        <span className="font-medium text-slate-700">{detail.label}:</span>
                        <span className="text-slate-900 font-semibold">{detail.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Market Insights */}
              <div className="animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Market Insights</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-blue-900 mb-2">+8.5%</div>
                      <div className="text-blue-700 font-medium">Area Appreciation</div>
                      <div className="text-sm text-blue-600 mt-1">Last 12 months</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6 text-center">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-green-900 mb-2">18 days</div>
                      <div className="text-green-700 font-medium">Avg. Days on Market</div>
                      <div className="text-sm text-green-600 mt-1">In this area</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-yellow-900 mb-2">95%</div>
                      <div className="text-yellow-700 font-medium">Sale to List Ratio</div>
                      <div className="text-sm text-yellow-600 mt-1">Recent sales</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Agent Contact Card */}
              <Card className="sticky top-24 shadow-xl animate-fade-in">
                <CardContent className="p-6 md:p-8">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-white font-bold text-3xl">JP</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Jigar Patel</h3>
                    <p className="text-slate-600 mb-2">Licensed Real Estate Professional</p>
                    <div className="flex items-center justify-center text-yellow-500 mb-4">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg key={star} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                      <span className="ml-2 text-slate-600 text-sm">(127 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center">
                      <Phone className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="font-medium">(416) 555-0123</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Mail className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="text-sm">jigar@jigarpatelrealestate.com</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full text-lg py-3">
                      <Mail className="h-5 w-5 mr-2" />
                      Send Email
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-lg py-3"
                      onClick={() => setShowContactForm(true)}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Viewing
                    </Button>
                  </div>

                  {/* Agent stats */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">500+</div>
                        <div className="text-xs text-slate-600">Homes Sold</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">15+</div>
                        <div className="text-xs text-slate-600">Years Exp.</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">5.0</div>
                        <div className="text-xs text-slate-600">Rating</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mortgage Calculator Card */}
              <Card className="shadow-lg animate-fade-in">
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
              </Card>

              {/* Property Download */}
              <Card className="shadow-lg animate-fade-in">
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
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Schedule Viewing</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowContactForm(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <InquiryForm />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetails;
