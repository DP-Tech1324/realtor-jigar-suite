
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContactForm, ContactFormData } from '@/hooks/useContactForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.5, type: 'spring' },
  }),
};

const ContactForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const { useSubmitContactForm } = useContactForm();
  const { mutate: submitContactForm, isPending, isError, error } = useSubmitContactForm();

  const onSubmit = (data: FormValues) => {
    const contactData: ContactFormData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message
    };
    
    submitContactForm(contactData, { 
      onSuccess: () => {
        form.reset();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    });
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "John Doe",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "john@example.com",
      type: "email",
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "(647) 555-1234",
      type: "text",
    },
  ];

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
            >
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Message sent successfully!</p>
                <p className="text-sm text-green-600">I'll get back to you within 24 hours.</p>
              </div>
            </motion.div>
          )}

          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Error sending message</p>
                <p className="text-sm text-red-600">Please try again or call me directly.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, idx) => (
            <motion.div key={field.name} variants={fadeInUp} custom={idx}>
              <FormField
                control={form.control}
                name={field.name as "name" | "email" | "phone"}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-realtor-navy">{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="p-3 border-2 border-gray-200 rounded-md focus:border-realtor-gold focus:ring-2 focus:ring-realtor-gold/20 transition-all duration-200 hover:border-gray-300"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} custom={fields.length}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-realtor-navy">Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="How can I help you with your real estate needs?"
                    className="min-h-[150px] p-3 border-2 border-gray-200 rounded-md focus:border-realtor-gold focus:ring-2 focus:ring-realtor-gold/20 transition-all duration-200 hover:border-gray-300 resize-none"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={fadeInUp} custom={2} whileTap={{ scale: 0.97 }}>
          <Button
            type="submit"
            className="w-full md:w-auto bg-realtor-gold hover:bg-realtor-navy hover:text-realtor-gold text-realtor-navy font-semibold px-8 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            disabled={isPending}
          >
            {isPending ? (
              <LoadingSpinner size="sm" text="Sending..." />
            ) : (
              'Send Message'
            )}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
};

export default ContactForm;
