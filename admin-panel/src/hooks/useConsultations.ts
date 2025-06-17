
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Define the interface for consultation data
export interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  date?: Date;
  time?: string;
  message?: string;
  propertyId?: string;
}

export interface Consultation extends ConsultationData {
  id: string;
  created_at: string;
}

export function useConsultations() {
  const { toast } = useToast();

  // Submit a new consultation request
  const submitConsultation = async (data: ConsultationData) => {
    console.log('Submitting consultation data:', data);
    
    try {
      // Format the date to ISO string if it exists
      const formattedDate = data.date ? format(data.date, 'yyyy-MM-dd') : null;
      
      const { error } = await supabase
        .from('consultations')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          consultation_type: data.consultationType,
          date: formattedDate,
          time: data.time,
          message: data.message || '',
          property_id: data.propertyId || null
        });
      
      if (error) {
        console.error('Error submitting consultation:', error);
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error in submitConsultation:', error);
      throw error;
    }
  };

  // Fetch all consultations
  const fetchConsultations = async (): Promise<Consultation[]> => {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      consultationType: item.consultation_type,
      date: item.date,
      time: item.time,
      message: item.message,
      propertyId: item.property_id,
      created_at: item.created_at
    }));
  };

  // Define the mutation for submitting consultation requests
  const useSubmitConsultation = () => 
    useMutation({
      mutationFn: submitConsultation,
      onSuccess: () => {
        toast({
          title: "Consultation requested",
          description: "Thank you! Your consultation request has been submitted.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error requesting consultation",
          description: error.message || "Failed to submit your consultation request. Please try again.",
          variant: "destructive"
        });
      }
    });

  // Query for fetching all consultations
  const useAllConsultations = () => 
    useQuery({
      queryKey: ['consultations'],
      queryFn: fetchConsultations
    });

  return { 
    useSubmitConsultation,
    useAllConsultations
  };
}
