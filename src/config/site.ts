// Single source of truth for business details.
// Anything marked TODO is a placeholder waiting on real information from Emporia.

export const site = {
  name: 'Emporia',
  legalName: 'Emporia Digital Marketing', // TODO: confirm registered business name
  tagline: 'Turning visibility into growth',
  description:
    'Emporia is a Ghaziabad digital marketing agency. We help local businesses get found on Google and turn that visibility into customers — and we show you the proof.',
  city: 'Ghaziabad',
  region: 'Uttar Pradesh',
  country: 'IN',

  contact: {
    phoneDisplay: '+91 00000 00000', // TODO: real phone number
    phoneE164: '+910000000000', // TODO: same number in +91XXXXXXXXXX format
    whatsapp: '910000000000', // TODO: WhatsApp number, digits only, with country code
    email: 'hello@example.com', // TODO: real email address
  },

  address: {
    street: 'TODO: office street address',
    locality: 'Ghaziabad',
    region: 'Uttar Pradesh',
    postalCode: '201001', // TODO: confirm PIN code
    country: 'IN',
    mapEmbedQuery: 'Ghaziabad, Uttar Pradesh', // TODO: replace with the exact office address / GBP name
  },

  hours: 'Mon–Sat, 10:00 am – 7:00 pm', // TODO: confirm hours

  social: {
    googleBusiness: '', // TODO: Google Business Profile link
    instagram: '',
    linkedin: '',
  },

  // Free key from https://web3forms.com — leads are emailed to the address it is registered with.
  web3formsKey: 'TODO_WEB3FORMS_ACCESS_KEY',

  whatsappMessage: 'Hi Emporia, I found you on your website and would like to discuss growing my business.',
} as const;

export const industries = [
  'Education & Academic',
  'Pre-sales',
  'Small Vendors & Retail',
  'Hardware & Trade',
  'Local Services',
] as const;

export const areas = [
  'Ghaziabad',
  'Indirapuram',
  'Vaishali',
  'Vasundhara',
  'Raj Nagar Extension',
  'Crossings Republik',
  'Kaushambi',
  'Noida',
  'Other',
] as const;

// TODO: draft list — confirm which services Emporia sells.
export const services = [
  {
    slug: 'local-seo',
    title: 'Local SEO & Google Maps',
    summary: 'Rank in the local map pack and “near me” searches in Ghaziabad, so customers nearby find you first.',
    points: ['Map-pack ranking tracked by grid', 'Local keyword pages', 'Citations & NAP consistency'],
  },
  {
    slug: 'google-business-profile',
    title: 'Google Business Profile',
    summary: 'A complete, active profile that turns searches into calls, direction requests and walk-ins.',
    points: ['Profile setup & optimisation', 'Weekly posts & photos', 'Review generation & replies'],
  },
  {
    slug: 'performance-ads',
    title: 'Google & Meta Ads',
    summary: 'Paid campaigns targeted to your area, measured on leads and revenue — not clicks.',
    points: ['Location-targeted campaigns', 'Call & WhatsApp lead tracking', 'Monthly spend vs. revenue report'],
  },
  {
    slug: 'social-media',
    title: 'Social Media',
    summary: 'Consistent, local content that builds trust with the people in your neighbourhood.',
    points: ['Content calendar', 'Reels & creatives', 'Community management'],
  },
  {
    slug: 'websites',
    title: 'Websites & Landing Pages',
    summary: 'Fast, simple websites built to rank locally and convert visitors into enquiries.',
    points: ['Mobile-first design', 'Lead forms & WhatsApp', 'Analytics set up from day one'],
  },
] as const;

export const nav = [
  { href: '/case-studies/', label: 'Case Studies' },
  { href: '/services/', label: 'Services' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;
