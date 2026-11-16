
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateInquiry } from '@/hooks/useListings';
import { CheckCircle, Loader2 } from 'lucide-react';
import { PHONE_HINT, PHONE_PATTERN, SHOWING_TIMES, TOPIC_MESSAGES, type InquiryType } from '@/lib/inquiries';

interface InquiryFormProps {
  listingId?: string;
  listingTitle?: string;
  initialMessage?: string;
  // What kind of request this is; the admin shows it as a badge and can filter by it
  inquiryType?: InquiryType;
  title?: string;
}

const todayIso = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

const InquiryForm: React.FC<InquiryFormProps> = ({ listingId, listingTitle, initialMessage, inquiryType = 'general', title }) => {
  const emptyMessage = initialMessage ?? (listingTitle
    ? `Hi Jigar, I'm interested in "${listingTitle}". Please contact me.`
    : TOPIC_MESSAGES[inquiryType]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: emptyMessage,
    preferred_date: '',
    preferred_time: '',
  });
  const [sent, setSent] = useState(false);
  const isShowing = inquiryType === 'showing';

  const createInquiry = useCreateInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createInquiry.mutateAsync({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
      listing_id: listingId,
      inquiry_type: inquiryType,
      preferred_date: isShowing && formData.preferred_date ? formData.preferred_date : undefined,
      preferred_time: isShowing && formData.preferred_time ? formData.preferred_time : undefined,
      page_url: window.location.href.slice(0, 500),
    });

    setSent(true);
    setFormData({ name: '', email: '', phone: '', message: emptyMessage, preferred_date: '', preferred_time: '' });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{isShowing ? 'Showing request sent' : 'Message sent'}</h3>
        <p className="text-gray-600">
          {isShowing
            ? 'Jigar will confirm the showing time with you shortly.'
            : 'Thank you. Jigar will get back to you soon.'}
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another message</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        {title || (listingTitle ? 'Inquire About This Property' : 'Contact Us')}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
            pattern={PHONE_PATTERN}
            title={PHONE_HINT}
            placeholder={isShowing ? 'So Jigar can confirm the time' : 'So Jigar can call you back'}
          />
        </div>

        {isShowing && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="preferred_date">Preferred date *</Label>
              <Input
                id="preferred_date"
                type="date"
                min={todayIso()}
                value={formData.preferred_date}
                onChange={(e) => handleChange('preferred_date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_time">Preferred time *</Label>
              <Select value={formData.preferred_time} onValueChange={(v) => handleChange('preferred_time', v)} required>
                <SelectTrigger id="preferred_time">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {SHOWING_TIMES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            required
            placeholder="Tell us about your real estate needs..."
            rows={isShowing ? 3 : 5}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={createInquiry.isPending || (isShowing && !formData.preferred_time)}
        >
          {createInquiry.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isShowing ? 'Request Showing' : 'Send Inquiry'}
        </Button>
      </form>
    </div>
  );
};

export default InquiryForm;
