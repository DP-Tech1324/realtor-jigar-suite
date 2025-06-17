
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail } from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  position: string;
  bio: string;
  phone: string;
  email: string;
  imageUrl: string;
}

const agents: Agent[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'Principal Broker',
    bio: '15+ years of experience in luxury real estate with a focus on waterfront properties.',
    phone: '(555) 123-4567',
    email: 'sarah@luxuryrealty.com',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80',
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    position: 'Luxury Property Specialist',
    bio: 'Former architect with unique insights into property values and renovation potential.',
    phone: '(555) 234-5678',
    email: 'michael@luxuryrealty.com',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
  },
  {
    id: 3,
    name: 'Emily Zhang',
    position: 'International Client Advisor',
    bio: 'Specializes in helping overseas investors find prime real estate opportunities.',
    phone: '(555) 345-6789',
    email: 'emily@luxuryrealty.com',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80',
  },
];

const Agents = () => {
  return (
    <section className="py-16 bg-realtor-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Meet Our Agents</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Our team of experienced professionals is dedicated to helping you achieve your real estate goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="h-80 overflow-hidden">
                <img 
                  src={agent.imageUrl} 
                  alt={agent.name} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-realtor-navy">{agent.name}</h3>
                <p className="text-realtor-gold font-medium mb-2">{agent.position}</p>
                <p className="text-gray-600 mb-4">{agent.bio}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Phone size={16} className="mr-2 text-realtor-navy" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail size={16} className="mr-2 text-realtor-navy" />
                    <span>{agent.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;
