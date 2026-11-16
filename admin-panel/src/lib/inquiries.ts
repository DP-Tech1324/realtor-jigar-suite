// Website inquiry kinds (inquiries.inquiry_type), set by the website's forms.
// Keep in step with client-site/src/lib/inquiries.ts.
export const INQUIRY_TYPES: Record<string, { label: string; className: string }> = {
  showing: { label: 'Showing request', className: 'bg-purple-100 text-purple-800' },
  info: { label: 'Property info', className: 'bg-blue-100 text-blue-800' },
  vastu: { label: 'Vastu', className: 'bg-amber-100 text-amber-800' },
  'pre-construction': { label: 'Pre-construction', className: 'bg-teal-100 text-teal-800' },
  buying: { label: 'Buying', className: 'bg-sky-100 text-sky-800' },
  selling: { label: 'Selling', className: 'bg-emerald-100 text-emerald-800' },
  renting: { label: 'Renting', className: 'bg-indigo-100 text-indigo-800' },
  commercial: { label: 'Commercial', className: 'bg-slate-200 text-slate-800' },
  general: { label: 'General', className: 'bg-gray-100 text-gray-700' },
};

export const inquiryTypeInfo = (type?: string | null) => INQUIRY_TYPES[type || 'general'] || { label: type || 'General', className: 'bg-gray-100 text-gray-700' };

export const WEBSITE_URL = 'https://realtor-jigar-suite.vercel.app';

// "Sat 22 Nov 2026, 2:00 PM" for a requested showing
export const formatShowing = (date?: string | null, time?: string | null) => {
  if (!date) return time || '';
  const d = new Date(`${date}T12:00:00`).toLocaleDateString('en-CA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return time ? `${d}, ${time}` : d;
};
