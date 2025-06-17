
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data/blog';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the blog post with the matching ID
  const post = blogPosts.find(post => post.id === id);
  
  // Redirect to the blog listing page if no post is found
  useEffect(() => {
    if (!post && id) {
      navigate('/blog');
    }
  }, [post, id, navigate]);
  
  if (!post) {
    return null; // This will be handled by the useEffect redirect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px]">
        {/* Hero section with image */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container px-4 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center justify-center gap-3 text-white/80">
                <span>{post.date}</span>
                <span className="hidden md:inline">•</span>
                <span>{post.author}</span>
                <span className="hidden md:inline">•</span>
                <span className="bg-realtor-gold/90 text-realtor-navy px-3 py-1 rounded-full text-sm">
                  {post.category}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article content */}
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => navigate('/blog')} 
              className="mb-8 flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Back to all articles
            </Button>
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>
        </article>
        
        {/* Related articles section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">More Articles You Might Like</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts
                .filter(p => p.id !== post.id && p.category === post.category)
                .slice(0, 3)
                .map(relatedPost => (
                  <div key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{relatedPost.title}</h3>
                      <p className="text-gray-600 mb-4">{relatedPost.excerpt.substring(0, 100)}...</p>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/blog/${relatedPost.id}`)}
                      >
                        Read Article
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
