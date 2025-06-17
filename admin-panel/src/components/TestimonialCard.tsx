
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Testimonial } from '@/types/Property';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card className="border border-gray-200 hover:border-realtor-gold hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        {testimonial.image && (
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-realtor-gold">
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <div className="text-center">
          <p className="mb-4 italic text-gray-600">"{testimonial.quote}"</p>
          <h4 className="font-bold text-realtor-navy">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.location}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
