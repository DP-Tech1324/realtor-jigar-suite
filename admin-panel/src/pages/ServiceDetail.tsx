
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type ServiceType = {
  id: string;
  title: string;
  description: string;
  image: string;
  fullDescription: string[];
  benefits: string[];
  process: Array<{step: string; description: string}>;
}

const services: Record<string, ServiceType> = {
  'property-sales': {
    id: 'property-sales',
    title: 'Property Sales',
    description: 'Specialized strategies to maximize your property\'s value and exposure in the market.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3',
    fullDescription: [
      'When it comes to selling your property, my comprehensive approach is designed to achieve the highest possible price in the shortest amount of time.',
      'From professional photography and staging consultations to targeted marketing campaigns and negotiation expertise, I provide a complete suite of services tailored to your specific property and market conditions.',
      'My extensive network of qualified buyers and relationships with other top agents helps ensure maximum exposure for your listing.'
    ],
    benefits: [
      'Professional property valuation based on recent comparable sales and market trends',
      'Expert advice on preparing your home for showings to maximize appeal',
      'Professional photography, videography, and virtual tours',
      'Strategic pricing to attract qualified buyers',
      'Targeted online and traditional marketing campaigns',
      'Skilled negotiation to secure favorable terms and conditions',
      'Thorough management of paperwork and closing process'
    ],
    process: [
      {step: 'Initial Consultation', description: 'We\'ll discuss your goals, timeline, and property details to create a customized selling strategy.'},
      {step: 'Property Preparation', description: 'I\'ll provide recommendations on repairs, staging, and improvements to maximize your property\'s appeal.'},
      {step: 'Marketing Launch', description: 'Your property will be professionally photographed and marketed across multiple channels to generate maximum interest.'},
      {step: 'Showings & Open Houses', description: 'I\'ll coordinate and conduct all showings, highlighting your property\'s best features to potential buyers.'},
      {step: 'Offer Reviews', description: 'We\'ll carefully analyze all offers, considering price, terms, and buyer qualifications.'},
      {step: 'Negotiation', description: 'I\'ll leverage my expertise to negotiate the best possible terms for your sale.'},
      {step: 'Closing Process', description: 'I\'ll manage all paperwork and coordinate with all parties to ensure a smooth closing process.'}
    ]
  },
  'property-acquisition': {
    id: 'property-acquisition',
    title: 'Property Acquisition',
    description: 'Personalized home buying guidance from search to closing and beyond.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3',
    fullDescription: [
      'Finding your ideal property requires more than just browsing listings. My property acquisition service offers a strategic approach to identifying, evaluating, and securing the perfect property for your needs.',
      'I provide access to all available listings—including pre-market opportunities—and offer expert guidance throughout the entire process, from initial search to final closing.',
      'With my deep knowledge of local neighborhoods, market values, and negotiation tactics, I\'ll help you make a confident and informed purchase decision.'
    ],
    benefits: [
      'Access to all available properties, including off-market opportunities',
      'In-depth neighborhood analyses and property evaluations',
      'Detailed comparative market analyses to ensure fair pricing',
      'Expert negotiation to secure the best possible terms',
      'Coordination of inspections and due diligence processes',
      'Guidance through financing options and mortgage processes',
      'Management of all paperwork and closing details'
    ],
    process: [
      {step: 'Needs Assessment', description: 'We\'ll discuss your must-haves, nice-to-haves, budget, and timeline to create a focused search strategy.'},
      {step: 'Property Search', description: 'I\'ll identify suitable properties matching your criteria, including off-market opportunities.'},
      {step: 'Property Tours', description: 'We\'ll tour selected properties together, with my expert eye pointing out potential issues and opportunities.'},
      {step: 'Offer Strategy', description: 'Once we\'ve found the right property, I\'ll develop a strategic offer based on market analysis.'},
      {step: 'Due Diligence', description: 'I\'ll coordinate inspections and help evaluate findings to ensure you know exactly what you\'re purchasing.'},
      {step: 'Negotiation', description: 'I\'ll negotiate price, terms, and conditions to protect your interests and secure the best deal.'},
      {step: 'Closing Coordination', description: 'I\'ll manage all aspects of the closing process to ensure a smooth transfer of ownership.'}
    ]
  },
  'relocation-services': {
    id: 'relocation-services',
    title: 'Relocation Services',
    description: 'Comprehensive support for clients moving to or from the Greater Toronto Area.',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3',
    fullDescription: [
      'Moving to a new city or region can be overwhelming. My relocation services provide the comprehensive support you need to make a smooth transition to or from the Greater Toronto Area.',
      'I offer personalized neighborhood tours, detailed community information, and connections to trusted local services to help you settle in quickly and comfortably.',
      'For those leaving the area, I can coordinate with agents in your destination city to ensure continuity of service throughout your move.'
    ],
    benefits: [
      'Virtual or in-person community tours tailored to your preferences',
      'Detailed information on schools, amenities, and transportation options',
      'Temporary housing options if needed before permanent relocation',
      'Connections to trusted local service providers',
      'Coordination with employers or relocation departments',
      'Streamlined buying or renting process with remote capabilities',
      'Ongoing support after your move to help you settle in'
    ],
    process: [
      {step: 'Initial Consultation', description: 'We\'ll discuss your relocation timeline, needs, and concerns to develop a personalized plan.'},
      {step: 'Area Orientation', description: 'I\'ll provide detailed information about neighborhoods, schools, amenities, and transportation options.'},
      {step: 'Housing Options', description: 'Based on your preferences, I\'ll identify suitable permanent housing options or temporary accommodations.'},
      {step: 'Virtual/In-Person Tours', description: 'We\'ll tour properties and neighborhoods either virtually or in person depending on your situation.'},
      {step: 'Service Connections', description: 'I\'ll connect you with trusted local services to help with your move and settling in.'},
      {step: 'Transaction Coordination', description: 'I\'ll manage the purchase or rental process, with special attention to remote signing and document handling if needed.'},
      {step: 'Follow-up Support', description: 'After your move, I\'ll continue to be a resource for you as you settle into your new community.'}
    ]
  }
};

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = serviceId ? services[serviceId] : null;

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-[72px] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-realtor-navy mb-4">Service Not Found</h1>
            <p className="mb-6">The service you're looking for doesn't exist or has been moved.</p>
            <Link to="/services">
              <Button className="bg-realtor-navy text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <PageHeader
          title={service.title}
          subtitle="Comprehensive real estate solutions tailored to your specific needs"
          bgImage={service.image}
        />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link to="/services" className="flex items-center text-realtor-navy hover:text-realtor-gold mb-8">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to All Services
              </Link>
              
              <div className="mb-12">
                <div className="space-y-4">
                  {service.fullDescription.map((paragraph, index) => (
                    <p key={index} className="text-lg text-gray-600">{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-realtor-navy mb-6">Key Benefits</h2>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-realtor-gold mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-bold text-realtor-navy mb-6">My Process</h2>
                <div className="space-y-6">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-realtor-gold text-realtor-navy font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-realtor-navy">{step.step}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-realtor-navy mb-4">Ready to Get Started?</h2>
                <p className="text-gray-600 mb-6">
                  Fill out the form below, and I'll be in touch within 24 hours to discuss how my {service.title} can help you achieve your real estate goals.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
