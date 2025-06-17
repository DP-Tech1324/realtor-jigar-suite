import AnimatedSection from "@/components/ui/AnimatedSection";
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import { Button } from '@/components/ui/button';
import Testimonials from '@/components/Testimonials';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Building2, Move, Landmark, LineChart, Crown } from 'lucide-react';
import { motion } from "framer-motion";

const serviceCards = [
  {
    icon: <HomeIcon className="h-10 w-10 text-realtor-gold mb-4" />,
    title: "Property Sales",
    desc: "Sell properties with confidence using our marketing expertise and strategic pricing.",
    link: "/property-sales",
  },
  {
    icon: <Building2 className="h-10 w-10 text-realtor-gold mb-4" />,
    title: "Property Acquisition",
    desc: "Strategic support to help you acquire the right property at the right time.",
    link: "/property-acquisition",
  },
  {
    icon: <Move className="h-10 w-10 text-realtor-gold mb-4" />,
    title: "Relocation Services",
    desc: "Personalized relocation support for individuals and families moving into or out of town.",
    link: "/relocation",
  },
  {
    icon: <Landmark className="h-10 w-10 text-realtor-gold mb-4" />,
    title: "Commercial Real Estate",
    desc: "End-to-end solutions for retail, office, and industrial property needs.",
    link: "/commercial",
  },
  {
    icon: <LineChart className="h-10 w-10 text-realtor-gold mb-4" />,
    title: "Investment Properties",
    desc: "Guidance and analysis for investors seeking profitable real estate opportunities.",
    link: "/investment",
  },
  {
    icon: <Crown className="h-10 w-10 text-realtor-gold mb-4" />,
    title: "Luxury Properties",
    desc: "Exclusive high-end services for luxury property buyers and sellers.",
    link: "/luxury",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.11, duration: 0.55, ease: "easeOut" }
  })
};

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section - animate in with fade up */}
        <AnimatedSection delay={0.05}><Hero /></AnimatedSection>
        
        {/* Featured Properties Section */}
        <AnimatedSection delay={0.12}><FeaturedProperties /></AnimatedSection>

        {/* Specialized Real Estate Services Section */}
        <AnimatedSection delay={0.18}>
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-realtor-navy mb-3">Specialized Real Estate Services</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Additional services tailored to meet specific real estate needs
                </p>
              </div>

              {/* Animate the grid container and each card inside */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {serviceCards.map((card, i) => (
                  <motion.div
                    key={card.title}
                    variants={cardVariants}
                    custom={i}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    {card.icon}
                    <h3 className="text-xl font-bold text-realtor-navy mb-3">{card.title}</h3>
                    <p className="text-gray-600 mb-4">{card.desc}</p>
                    <Link to={card.link}>
                      <Button className="border-realtor-navy text-realtor-navy hover:bg-realtor-navy hover:text-white">
                        Learn More
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection delay={0.22}><Testimonials /></AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection delay={0.27}>
          <div className="bg-realtor-light-gray py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
