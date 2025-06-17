
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <div className="bg-realtor-navy py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              We're here to answer your questions and help with your real estate needs
            </p>
          </div>
        </div>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact information cards */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                  <h2 className="text-2xl font-semibold text-realtor-navy mb-4">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="text-realtor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-medium">Office Address</h4>
                        <p className="text-gray-600">
                          Royal LePage<br />
                          7646 Weston Rd<br />
                          Woodbridge, ON L4L 9J9
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="text-realtor-gold mr-3 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-medium">Phone</h4>
                        <p className="text-gray-600">(647) 555-1234</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="text-realtor-gold mr-3 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <a href="mailto:jigar@royallepage.ca" className="text-gray-600 hover:text-realtor-gold">
                          jigar@royallepage.ca
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="text-realtor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-medium">Business Hours</h4>
                        <p className="text-gray-600">
                          Monday - Friday: 9am - 6pm<br />
                          Saturday: 10am - 4pm<br />
                          Sunday: By appointment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-semibold text-realtor-navy mb-4">Connect With Me</h2>
                  <p className="text-gray-600 mb-4">
                    Follow me on social media for market updates and real estate tips.
                  </p>
                  <div className="flex space-x-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                      className="bg-realtor-navy text-white p-2 rounded-full hover:bg-realtor-gold transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                      className="bg-realtor-navy text-white p-2 rounded-full hover:bg-realtor-gold transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                      className="bg-realtor-navy text-white p-2 rounded-full hover:bg-realtor-gold transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                      className="bg-realtor-navy text-white p-2 rounded-full hover:bg-realtor-gold transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                  <h2 className="text-2xl font-semibold text-realtor-navy mb-6">Send Me a Message</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Find Us</h2>
            <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.0504772236395!2d-79.5307329!3d43.8008109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDQ4JzAyLjkiTiA3OcKwMzEnNTAuNyJX!5e0!3m2!1sen!2sca!4v1621592545043!5m2!1sen!2sca"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
