
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Home, Edit, Trash2, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAdminListingsQuery, useDeleteListing } from "@/hooks/useAdminListings";
import ListingForm from "./ListingForm";

const AdminListingsTab = () => {
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  const { data: listings, isLoading: listingsLoading } = useAdminListingsQuery();
  const deleteListing = useDeleteListing();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateListing = () => {
    setSelectedListing(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditListing = (listing: any) => {
    setSelectedListing(listing);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await deleteListing.mutateAsync(listingId);
    } catch (error) {
      console.error('Delete listing error:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      sold: "bg-blue-100 text-blue-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    return variants[status] || variants.active;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Listings</CardTitle>
          <Button onClick={handleCreateListing}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Button>
        </CardHeader>
        <CardContent>
          {listingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading listings...</span>
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{listing.title}</h3>
                      <Badge className={getStatusBadge(listing.status)}>
                        {listing.status}
                      </Badge>
                      {listing.is_featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{listing.address}, {listing.city}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-green-600 font-medium">
                        {listing.price ? formatCurrency(listing.price) : 'Price on request'}
                      </p>
                      {listing.bedrooms && (
                        <span className="text-sm text-gray-500">
                          {listing.bedrooms} bed
                        </span>
                      )}
                      {listing.bathrooms && (
                        <span className="text-sm text-gray-500">
                          {listing.bathrooms} bath
                        </span>
                      )}
                      {listing.square_footage && (
                        <span className="text-sm text-gray-500">
                          {listing.square_footage} sq ft
                        </span>
                      )}
                    </div>
                    {listing.mls_number && (
                      <p className="text-xs text-gray-400 mt-1">MLS# {listing.mls_number}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditListing(listing)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{listing.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteListing(listing.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No listings found</p>
              <Button 
                onClick={handleCreateListing} 
                className="mt-4"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ListingForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        listing={selectedListing}
        mode={formMode}
      />
    </>
  );
};

export default AdminListingsTab;
