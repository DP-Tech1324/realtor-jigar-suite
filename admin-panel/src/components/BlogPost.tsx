
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface BlogPostProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
  content?: string;
}

interface BlogPostComponentProps {
  post: BlogPostProps;
}

const BlogPost: React.FC<BlogPostComponentProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/blog/${post.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">{post.date}</span>
          <span className="bg-realtor-gold/80 text-realtor-navy text-xs px-2 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        <Link to={`/blog/${post.id}`}>
          <h3 className="text-xl font-bold mb-3 hover:text-realtor-gold transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">By {post.author}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-realtor-navy hover:text-realtor-gold"
            asChild
          >
            <Link to={`/blog/${post.id}`}>Read More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
