
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon, Trash2, Search, Filter } from 'lucide-react';

const ImageManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const images = [
    {
      id: 1,
      name: 'property-1-front.jpg',
      url: '/api/placeholder/300/200',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      category: 'Properties',
      description: 'Front view of 123 Main St'
    },
    {
      id: 2,
      name: 'property-1-kitchen.jpg',
      url: '/api/placeholder/300/200',
      size: '1.8 MB',
      uploadDate: '2024-01-15',
      category: 'Properties',
      description: 'Modern kitchen with granite countertops'
    },
    {
      id: 3,
      name: 'agent-headshot.jpg',
      url: '/api/placeholder/300/200',
      size: '856 KB',
      uploadDate: '2024-01-14',
      category: 'Team',
      description: 'Professional headshot'
    },
    {
      id: 4,
      name: 'office-exterior.jpg',
      url: '/api/placeholder/300/200',
      size: '3.2 MB',
      uploadDate: '2024-01-13',
      category: 'Company',
      description: 'Office building exterior'
    }
  ];

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = images.reduce((sum, image) => {
    const sizeInMB = parseFloat(image.size.replace(' MB', '').replace(' KB', '')) * 
                     (image.size.includes('KB') ? 0.001 : 1);
    return sum + sizeInMB;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-realtor-navy">Image Management</h1>
        <p className="text-gray-600 mt-2">Upload and manage property images and media</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">{totalSize.toFixed(1)} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-realtor-gold" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Property Images</p>
                <p className="text-2xl font-bold">{images.filter(i => i.category === 'Properties').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-realtor-gold transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop files here, or{' '}
              <Button variant="link" className="p-0 h-auto text-realtor-gold">
                browse
              </Button>{' '}
              to select files
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports: JPG, PNG, WEBP up to 10MB each
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Image Library</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div key={image.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate" title={image.name}>
                    {image.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{image.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{image.size}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {image.category}
                    </span>
                    <span className="text-xs text-gray-500">{image.uploadDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageManagement;
