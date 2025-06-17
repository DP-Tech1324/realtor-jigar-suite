
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ConsultationTypeField = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="consultationType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Consultation Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a consultation type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="buyer">Buyer Consultation</SelectItem>
              <SelectItem value="seller">Seller Consultation</SelectItem>
              <SelectItem value="investment">Investment Consultation</SelectItem>
              <SelectItem value="mortgage">Mortgage Consultation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Select the type of consultation you're interested in.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ConsultationTypeField;
