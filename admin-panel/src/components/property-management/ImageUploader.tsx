import React, { useState, useRef } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  initialImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ initialImages = [], onImagesChange, maxImages = 10 }: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalImages = selectedFiles.length + uploadedImages.length;
  const canAddMoreImages = totalImages < maxImages;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !canAddMoreImages) return;
    
    const newFiles = Array.from(e.target.files);
    const allowedFiles = newFiles.slice(0, maxImages - totalImages);
    
    setSelectedFiles(prev => [...prev, ...allowedFiles]);
    
    // Generate previews
    allowedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Clear input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = (imageUrl: string) => {
    setUploadedImages(prev => prev.filter(url => url !== imageUrl));
    onImagesChange(uploadedImages.filter(url => url !== imageUrl));
    
    // Optional: Remove from Supabase storage as well
    // This would require extracting the path from the URL and calling supabase.storage.from('bucket').remove([path])
    const path = imageUrl.split('/').pop();
    if (path) {
      supabase.storage
        .from('property-images')
        .remove([`property-images/${path}`])
        .then(({ error }) => {
          if (error) {
            const errorMessage = error.message || 'Unknown error';
            console.error('Error removing image from storage:', errorMessage);
          }
        });
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const newImageUrls: string[] = [];
    let completedUploads = 0;
    
    for (const file of selectedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `property-images/${fileName}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(data.path);
        
        newImageUrls.push(publicUrl);
        
        completedUploads++;
        setUploadProgress(Math.round((completedUploads / selectedFiles.length) * 100));
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error uploading image:', errorMessage);
      }
    }
    
    // Update state with new images
    const updatedImages = [...uploadedImages, ...newImageUrls];
    setUploadedImages(updatedImages);
    onImagesChange(updatedImages);
    
    // Clear selected files and previews after successful upload
    setSelectedFiles([]);
    setPreviews([]);
    setIsUploading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Display uploaded images */}
        {uploadedImages.map((imageUrl, index) => (
          <div 
            key={`uploaded-${index}`} 
            className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-300"
          >
            <img 
              src={imageUrl} 
              alt={`Property image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeUploadedImage(imageUrl)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Display selected file previews */}
        {previews.map((preview, index) => (
          <div 
            key={`preview-${index}`} 
            className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-300"
          >
            <img 
              src={preview} 
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeSelectedFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Add image button */}
        {canAddMoreImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
          >
            <Upload size={24} className="text-gray-500" />
          </button>
        )}
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Upload button - only show if there are selected files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Button
            type="button"
            onClick={uploadFiles}
            disabled={isUploading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'image' : 'images'}
              </>
            )}
          </Button>
          
          {isUploading && (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="bg-realtor-navy h-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
      
      <div className="text-sm text-gray-500">
        {canAddMoreImages ? (
          `You can upload up to ${maxImages - totalImages} more images`
        ) : (
          `Maximum ${maxImages} images allowed`
        )}
      </div>
    </div>
  );
}