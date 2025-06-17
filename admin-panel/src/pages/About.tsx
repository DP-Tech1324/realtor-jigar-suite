import Image from "@/components/ui/Image";
import AnimatedSection from "@/components/ui/AnimatedSection";

import RECOLogo from "@/assets/images/logos/realtor.jpeg";
import CREALogo from "@/assets/images/logos/realtor.jpeg";
import TRREBLogo from "@/assets/images/logos/TERB.jpg";
import RLPLogo from "@/assets/images/logos/Jigar_Patel_Logo.png";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Phone, Mail, Award, Users, ThumbsUp, School, Home } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[72px]">
        {/* Animated Page Header */}
        <AnimatedSection delay={0.05}>
          <PageHeader 
            title="About Jigar Patel" 
            subtitle="Your Trusted Real Estate Professional"
            bgImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
          />
        </AnimatedSection>

        {/* Bio, Contact, Profile Section */}
        <AnimatedSection delay={0.13}>
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Image and Contact */}
                <div className="lg:col-span-1">
                  <div className="mb-8">
                    <img 
                      src="src/assets/images/agents/IMG_9799.JPG" 
                      alt="Jigar Patel" 
                      className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[3/4]"
                    />
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                    <h3 className="text-xl font-bold text-realtor-navy mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-realtor-gold mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">(647) 555-1234</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-realtor-gold mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">jigar@royallepage.ca</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link to="/contact">
                        <Button className="w-full bg-realtor-gold text-realtor-navy hover:bg-realtor-gold/90">
                          Contact Me
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-realtor-navy mb-4">Office</h3>
                    <p className="mb-1 font-medium">Royal LePage</p>
                    <p className="text-gray-700">
                      7646 Weston Rd<br />
                      Woodbridge, ON L4L 9J9
                    </p>
                  </div>
                </div>
                {/* Bio and Details */}
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold text-realtor-navy mb-6">About Me</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p className="mb-4">
                      As a dedicated real estate professional with Royal LePage, I bring an intimate knowledge of the Greater Toronto Area market, combining local expertise with personalized service to help you achieve your real estate goals.
                    </p>
                    <p className="mb-4">
                      With years of experience in the industry, I understand that buying or selling a home is more than just a transaction—it's a significant life decision. My commitment is to provide exceptional, personalized service for all of my clients, guiding them through every step of the process with care and attention to detail.
                    </p>
                    <p className="mb-8">
                      Whether you're a first-time homebuyer, looking to sell your property, or interested in investment opportunities, I have the expertise and resources to help you succeed in today's competitive market.
                    </p>
                    <h3 className="text-2xl font-bold text-realtor-navy mb-4">My Mission</h3>
                    <p className="mb-8">
                      My mission is simple: to help you achieve your real estate goals with integrity, professionalism, and dedication. I believe in building long-lasting relationships based on trust, ensuring that every client receives the attention and expertise they deserve.
                    </p>
                    <h3 className="text-2xl font-bold text-realtor-navy mb-4">Specialties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-start">
                        <Award className="h-5 w-5 text-realtor-gold mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold">Residential Sales</h4>
                          <p className="text-sm text-gray-600">Expert in single-family homes, condos, and townhouses</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-realtor-gold mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold">First-Time Buyers</h4>
                          <p className="text-sm text-gray-600">Specialized guidance for navigating first purchases</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <ThumbsUp className="h-5 w-5 text-realtor-gold mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold">Luxury Properties</h4>
                          <p className="text-sm text-gray-600">Marketing and selling high-end real estate</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <School className="h-5 w-5 text-realtor-gold mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold">Investment Properties</h4>
                          <p className="text-sm text-gray-600">Identifying valuable investment opportunities</p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-realtor-navy mb-4">Credentials</h3>
                    <ul className="list-disc pl-5 mb-8">
                      <li>Licensed Real Estate Professional - RECO</li>
                      <li>Member of Toronto Regional Real Estate Board (TRREB)</li>
                      <li>Member of Canadian Real Estate Association (CREA)</li>
                      <li>Royal LePage Diamond Award Recipient</li>
                    </ul>
                  </div>
                  <div className="flex mt-8">
                    <Link to="/contact">
                      <Button size="lg" className="bg-realtor-gold text-realtor-navy hover:bg-realtor-gold/90 mr-4">
                        Contact Me
                      </Button>
                    </Link>
                    <Link to="/listings">
                      <Button size="lg" variant="outline" className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy/10">
                        View Listings
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Specialties Section */}
        <AnimatedSection delay={0.21}>
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-realtor-navy mb-3">My Specialties</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Areas of expertise that help me deliver exceptional results for my clients
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add more specialties here as needed */}
                <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-realtor-gold/20 text-realtor-gold rounded-full flex items-center justify-center mb-6">
                    <Home size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-realtor-navy mb-3">Residential Properties</h3>
                  <p className="text-gray-600">
                    Expert in single-family homes, townhouses, and condos throughout the Greater Toronto Area, with particular focus on Woodbridge, Vaughan, and Richmond Hill.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-realtor-gold/20 text-realtor-gold rounded-full flex items-center justify-center mb-6">
                    <Award size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-realtor-navy mb-3">Luxury Market</h3>
                  <p className="text-gray-600">
                    Specialized knowledge of the luxury real estate market, with a track record of successful high-end property transactions and premium client service.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-realtor-gold/20 text-realtor-gold rounded-full flex items-center justify-center mb-6">
                    <ThumbsUp size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-realtor-navy mb-3">First-Time Buyers</h3>
                  <p className="text-gray-600">
                    Dedicated to guiding first-time homebuyers through the entire process, from financing options to closing, with clear communication and education.
                  </p>
                </div>
              </div>
              <div className="mt-16 text-center">
                <h3 className="text-2xl font-bold text-realtor-navy mb-6">My Mission</h3>
                <p className="text-xl text-gray-600 italic max-w-3xl mx-auto">
                  "To provide exceptional service with integrity and transparency, helping clients achieve their real estate goals while building lasting relationships based on trust and results."
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Credentials Section */}
        <AnimatedSection delay={0.29}>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-realtor-navy mb-3">Professional Credentials</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Education, certifications, and affiliations that enhance my service to you
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Image src={RECOLogo} alt="RECO" className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-bold text-realtor-navy mb-2">Licensed Realtor</p>
                  <p className="text-gray-600">Real Estate Council of Ontario</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Image src={CREALogo} alt="CREA" className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-bold text-realtor-navy mb-2">Member</p>
                  <p className="text-gray-600">Canadian Real Estate Association</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Image src={TRREBLogo} alt="TRREB" className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-bold text-realtor-navy mb-2">Member</p>
                  <p className="text-gray-600">Toronto Regional Real Estate Board</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <Image src={RLPLogo} alt="Royal LePage Award" className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-bold text-realtor-navy mb-2">Top Producer</p>
                  <p className="text-gray-600">Royal LePage Diamond Award</p>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Client Experiences Section */}
        <AnimatedSection delay={0.37}>
          <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-realtor-navy mb-3">Client Experiences</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Hear what my clients say about working with me!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Example Testimonial Card 1 */}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                  <svg className="h-10 w-10 text-realtor-gold mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M7 8V6a5 5 0 1110 0v2" />
                  </svg>
                  <p className="text-gray-700 mb-4 italic">
                    "Jigar helped us buy our first home and made the process completely stress-free. He was patient, knowledgeable, and always available to answer our questions!"
                  </p>
                  <span className="font-semibold text-realtor-navy">— Pooja & Rahul S., Mississauga</span>
                </div>
                {/* Example Testimonial Card 2 */}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                  <svg className="h-10 w-10 text-realtor-gold mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M7 8V6a5 5 0 1110 0v2" />
                  </svg>
                  <p className="text-gray-700 mb-4 italic">
                    "He negotiated a great price on my investment property and handled every detail. Highly recommended for investors."
                  </p>
                  <span className="font-semibold text-realtor-navy">— David P., Toronto</span>
                </div>
                {/* Example Testimonial Card 3 */}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                  <svg className="h-10 w-10 text-realtor-gold mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M7 8V6a5 5 0 1110 0v2" />
                  </svg>
                  <p className="text-gray-700 mb-4 italic">
                    "Jigar’s knowledge of the GTA helped us relocate quickly and easily. We felt supported at every step."
                  </p>
                  <span className="font-semibold text-realtor-navy">— The Ahmed Family, Brampton</span>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection delay={0.44}>
          <section className="py-16 bg-realtor-navy">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Let's Work Together</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                I'm ready to help you with all your real estate needs. Let's connect and discuss how I can assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy font-medium">
                    Schedule a Consultation
                  </Button>
                </Link>
                <Link to="/listings">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-realtor-navy">
                    Browse My Listings
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
};

export default About;
