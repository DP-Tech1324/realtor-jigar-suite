
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  consultationType: z.string({
    required_error: "Please select a consultation type.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a preferred time.",
  }),
  message: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export interface ConsultationFormProps {
  defaultType?: string;
  propertyId?: string;
  onSubmitSuccess?: () => void;
}
