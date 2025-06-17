
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store the email in Supabase newsletter_subscriptions table
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email });
      
      if (error) {
        if (error.code === '23505') { // Unique violation error code
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "default"
          });
        } else {
          console.error('Error subscribing to newsletter:', error);
          toast({
            title: "Subscription failed",
            description: "There was an error subscribing to the newsletter. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Subscription successful!",
          description: "Thank you for subscribing to our newsletter.",
        });
        
        setEmail('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <footer className="bg-realtor-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Contact Info */}
          <div>
            <Link to="/" className="flex items-center mb-6">
              <h1 className="text-2xl font-bold">
                <span className="text-realtor-gold">Jigar </span>Patel
              </h1>
            </Link>
            <p className="text-white/80 mb-4">
              Your trusted real estate advisor in the Greater Toronto Area.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span>(647) 555-1234</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:jigar@royallepage.ca">jigar@royallepage.ca</a>
              </div>
              <div className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>Royal LePage<br />7646 Weston Rd, Woodbridge<br />ON L4L 9J9</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-realtor-gold transition-colors">Home</Link></li>
              <li><Link to="/listings" className="hover:text-realtor-gold transition-colors">Properties</Link></li>
              <li><Link to="/about" className="hover:text-realtor-gold transition-colors">About Me</Link></li>
              <li><Link to="/buyers" className="hover:text-realtor-gold transition-colors">Buyer Resources</Link></li>
              <li><Link to="/sellers" className="hover:text-realtor-gold transition-colors">Seller Resources</Link></li>
              <li><Link to="/contact" className="hover:text-realtor-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/calculators" className="hover:text-realtor-gold transition-colors">Mortgage Calculator</Link></li>
              <li><Link to="/calculators" className="hover:text-realtor-gold transition-colors">Affordability Calculator</Link></li>
              <li><Link to="/valuation" className="hover:text-realtor-gold transition-colors">Free Home Valuation</Link></li>
              <li><Link to="/blog" className="hover:text-realtor-gold transition-colors">Real Estate Blog</Link></li>
              <li><Link to="/buyers" className="hover:text-realtor-gold transition-colors">First-Time Buyer Guide</Link></li>
              <li><Link to="/sellers" className="hover:text-realtor-gold transition-colors">Selling Tips</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Media & Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Me</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-realtor-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-realtor-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-realtor-gold transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-realtor-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
            <p className="text-white/80 mb-4">
              Subscribe to my newsletter for market updates and real estate tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="rounded-l text-black flex-grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <Button 
                type="submit"
                className="bg-realtor-gold text-realtor-navy rounded-r font-medium" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/60">
            © {currentYear} Jigar Patel, Royal LePage. All Rights Reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex text-sm text-white/60 space-x-6">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
              <li><Link to="/sitemap" className="hover:text-white">Sitemap</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
