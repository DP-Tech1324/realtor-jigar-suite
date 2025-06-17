import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Form,
} from '@/components/ui/form';
import { useConsultations } from '@/hooks/useConsultations';
import { useToast } from '@/hooks/use-toast';
import { formSchema, FormValues, ConsultationFormProps } from '@/components/consultation/consultationSchema';
import PersonalInfoFields from '@/components/consultation/PersonalInfoFields';
import ConsultationTypeField from '@/components/consultation/ConsultationTypeField';
import DateTimeFields from '@/components/consultation/DateTimeFields';
import MessageField from '@/components/consultation/MessageField';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.5, type: 'spring' },
  }),
};

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  defaultType,
  propertyId,
  onSubmitSuccess
}) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      consultationType: defaultType || "",
      message: "",
    },
  });

  const { useSubmitConsultation } = useConsultations();
  const { mutate: submitConsultation, isPending } = useSubmitConsultation();

  const onSubmit = (data: FormValues) => {
    submitConsultation({
      name: data.name,
      email: data.email,
      phone: data.phone,
      consultationType: data.consultationType,
      date: data.date,
      time: data.time,
      message: data.message || "",
      propertyId: propertyId
    }, {
      onSuccess: () => {
        form.reset();
        if (onSubmitSuccess) {
          onSubmitSuccess();
        } else {
          toast({
            title: "Consultation request submitted",
            description: "We will contact you shortly to confirm your appointment.",
          });
        }
      },
      onError: (error) => {
        toast({
          title: "Error submitting request",
          description: "There was a problem submitting your request. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  // Animate each section in order
  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp} custom={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonalInfoFields />
            <ConsultationTypeField />
            <DateTimeFields />
          </div>
        </motion.div>
        <motion.div variants={fadeInUp} custom={1}>
          <MessageField />
        </motion.div>
        <motion.div variants={fadeInUp} custom={2} whileTap={{ scale: 0.97 }}>
              <Button
               type="submit"
                className="w-full md:w-auto bg-realtor-gold hover:bg-realtor-navy hover:text-realtor-gold text-realtor-navy font-semibold px-8 py-3 transition-all"
                disabled={isPending}
              >
                   {isPending ? 'Scheduling...' : 'Schedule Consultation'}
                  </Button>
            </motion.div>
      </motion.form>
    </Form>
  );
};


export default ConsultationForm;
