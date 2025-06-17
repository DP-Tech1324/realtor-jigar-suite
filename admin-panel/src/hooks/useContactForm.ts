
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function useContactForm() {
  const { toast } = useToast();
  
  const submitContactForm = async (data: ContactFormData) => {
    console.log('Submitting contact form data:', data);
    
    try {
      // Insert contact request into Supabase
      const { error } = await supabase
        .from('realtorjigar_x8d1y_inquiries')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message
        });
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Contact form submitted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in submitContactForm:', error);
      throw error;
    }
  };
  
  const useSubmitContactForm = () => 
    useMutation({
      mutationFn: submitContactForm,
      onSuccess: () => {
        toast({
          title: "Message sent",
          description: "Thank you for contacting us! We will get back to you soon.",
        });
      },
      onError: (error: any) => {
        console.error('Mutation error:', error);
        toast({
          title: "Error sending message",
          description: error.message || "Failed to send your message. Please try again.",
          variant: "destructive"
        });
      }
    });
  
  return { useSubmitContactForm };
}
