import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';
import ConsultationForm from '@/components/ConsultationForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSection from "@/components/ui/AnimatedSection";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[72px]">
        {/* Animated Page Header */}
        <AnimatedSection delay={0.05}>
          <PageHeader 
            title="Contact Me" 
            subtitle="I'm here to help with all your real estate needs"
            bgImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
          />
        </AnimatedSection>

        {/* Contact Information Section */}
        <AnimatedSection delay={0.13}>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <h2 className="text-3xl font-bold text-realtor-navy mb-6">
                    Get in Touch
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Whether you have a question about buying or selling a property, or just want to discuss the real estate market, I'm here to help.
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1 bg-realtor-gold/20 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-realtor-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-realtor-navy mb-1">Phone</h3>
                        <p className="text-gray-600">(647) 555-1234</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-4 mt-1 bg-realtor-gold/20 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-realtor-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-realtor-navy mb-1">Email</h3>
                        <p className="text-gray-600">jigar@royallepage.ca</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-4 mt-1 bg-realtor-gold/20 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-realtor-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-realtor-navy mb-1">Office Address</h3>
                        <p className="text-gray-600">
                          Royal LePage<br />
                          7646 Weston Rd<br />
                          Woodbridge, ON L4L 9J9
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-4 mt-1 bg-realtor-gold/20 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-realtor-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-realtor-navy mb-1">Business Hours</h3>
                        <p className="text-gray-600">
                          Monday - Friday: 9:00 AM - 8:00 PM<br />
                          Saturday: 10:00 AM - 6:00 PM<br />
                          Sunday: 11:00 AM - 5:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabbed Forms */}
                <div className="lg:col-span-2">
                  <Tabs defaultValue="contact" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="contact">Contact Form</TabsTrigger>
                      <TabsTrigger value="consultation">Book Consultation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="contact" className="bg-gray-50 p-6 md:p-8 rounded-lg">
                      <h3 className="text-2xl font-bold text-realtor-navy mb-6">Send Me a Message</h3>
                      <ContactForm />
                    </TabsContent>
                    <TabsContent value="consultation" className="bg-gray-50 p-6 md:p-8 rounded-lg">
                      <h3 className="text-2xl font-bold text-realtor-navy mb-6">Schedule a Consultation</h3>
                      <ConsultationForm />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Map Section */}
        <AnimatedSection delay={0.22}>
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-realtor-navy mb-3">
                  Find Me
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  My office is conveniently located in Woodbridge
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg h-96">
                <iframe 
                  title="Office Location"
                  className="w-full h-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2878.6294172733374!2d-79.53544068416153!3d43.79258927911615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2f43a6edfe3f%3A0x38cc923da3b8d921!2s7646%20Weston%20Rd%2C%20Woodbridge%2C%20ON%20L4L%209J9!5e0!3m2!1sen!2sca!4v1620815662877!5m2!1sen!2sca"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection delay={0.29}>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-realtor-navy mb-3">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Common questions about working together
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div>
                  <h3 className="text-xl font-bold text-realtor-navy mb-2">What areas do you serve?</h3>
                  <p className="text-gray-600">
                    I primarily serve the Greater Toronto Area, with a focus on Woodbridge, Vaughan, Richmond Hill, and surrounding communities. However, I can also assist clients throughout the GTA.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-realtor-navy mb-2">Do you work with first-time home buyers?</h3>
                  <p className="text-gray-600">
                    Absolutely! I specialize in helping first-time buyers navigate the complex process of purchasing their first home, providing education, guidance, and support every step of the way.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-realtor-navy mb-2">How quickly can you respond to my inquiry?</h3>
                  <p className="text-gray-600">
                    I pride myself on prompt communication and typically respond to all inquiries within 24 hours, often much sooner. For urgent matters, I'm available by phone during business hours.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-realtor-navy mb-2">Is there a fee for an initial consultation?</h3>
                  <p className="text-gray-600">
                    No, initial consultations are complimentary. I believe in building relationships based on trust and value, so I'm happy to meet with you to discuss your real estate needs without any obligation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Social Media Section */}
        <AnimatedSection delay={0.36}>
          <section className="py-16 bg-realtor-navy">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Connect With Me</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Follow me on social media for market updates, new listings, and real estate tips
              </p>
              <div className="flex justify-center space-x-6">
                {/* Social icons as in your code */}
                {/* ... (social icon links code remains the same) ... */}
                {/* copy your social links code here */}
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
