export interface Product {
  /** Unique slug identifier, e.g. "xpro" */
  id: string;

  /** Display name, e.g. "Xpro" */
  name: string;

  /** Battery spec string, e.g. "36V 8Ah (LiFePO4)" */
  battery: string;

  /** Motor spec string, e.g. "36V 350W Hub Motor" */
  motor: string;

  /** Claimed range in kilometres */
  rangeKm: number;

  /** Top speed in km/h */
  topSpeedKmph: number;

  /** Available colour options as CSS hex values */
  colors: string[];

  /** Marketing bullet points shown on the product card */
  keyFeatures: string[];

  /** On-road price in INR (including tax) */
  price: number;

  /** Short qualifier shown next to price, e.g. "incl. tax" */
  priceNote: string;

  /** Fixed booking-advance amount in INR */
  advanceAmount: number;

  /** Relative or absolute URL to the hero product image */
  imageUrl: string;

  /** Whether the variant is currently available for purchase */
  inStock: boolean;
}
