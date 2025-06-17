
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import PropertyCardSkeleton from '@/components/ui/PropertyCardSkeleton';
import { Property } from '@/types/Property';
import { Home } from 'lucide-react';

interface PropertyGridProps {
  filteredProperties: Property[];
  resetFilters: () => void;
  isLoading?: boolean;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ 
  filteredProperties, 
  resetFilters,
  isLoading = false 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-realtor-navy">
          {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Found
        </h3>
        
        {/* Quick stats on mobile */}
        <div className="flex gap-2 text-sm text-gray-600 sm:hidden">
          <span>Available: {filteredProperties.filter(p => {
            const status = p.market_status || (p.status === 'published' ? 'for-sale' : 'draft');
            return status === 'for-sale' || status === 'for-rent';
          }).length}</span>
          <span>•</span>
          <span>Sold: {filteredProperties.filter(p => {
            const status = p.market_status || (p.status === 'published' ? 'for-sale' : 'draft');
            return status === 'sold';
          }).length}</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {filteredProperties.length > 0 ? (
          <motion.div
            key="properties-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                layout
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-properties"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 md:p-12 rounded-lg text-center shadow-sm border border-gray-100"
          >
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any properties matching your current filters. Try adjusting your search criteria to see more results.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={resetFilters} 
                className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy font-medium px-6"
              >
                Clear All Filters
              </Button>
              <Button 
                variant="outline" 
                className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white font-medium px-6"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination hint for mobile */}
      {filteredProperties.length > 9 && (
        <motion.div 
          className="mt-8 text-center text-sm text-gray-500 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Showing {Math.min(filteredProperties.length, 9)} of {filteredProperties.length} properties</p>
        </motion.div>
      )}
    </>
  );
};

export default PropertyGrid;
