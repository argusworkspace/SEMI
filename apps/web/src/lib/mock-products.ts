// TODO(backend): replace with GET /api/products fetch once backend is live

import type { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "xpro",
    name: "Xpro",
    battery: "36V 8Ah (LiFePO4)",
    motor: "36V 350W Hub Motor",
    rangeKm: 40,
    topSpeedKmph: 28,
    colors: [
      "#FFFFFF", // White
      "#3B82F6", // Blue
      "#EAB308", // Yellow
      "#374151", // Charcoal
    ],
    keyFeatures: [
      "Pedal Assist System",
      "Digital Speedometer",
      "Loud Horn",
      "Bright Front Light",
      "Odometer",
      "Optimized Frame Design",
    ],
    price: 27000,
    priceNote: "incl. tax",
    advanceAmount: 5000,
    imageUrl: "/images/products/xpro.png",
    inStock: true,
  },
  {
    id: "x-variant",
    name: "X Variant",
    battery: "24V 7Ah",
    motor: "24V 350W",
    rangeKm: 35,
    topSpeedKmph: 25,
    colors: [
      "#FFFFFF", // White
      "#3B82F6", // Blue
      "#EAB308", // Yellow
      "#374151", // Charcoal
    ],
    keyFeatures: [
      "Pedal Assist System",
      "Digital Speedometer",
      "Loud Horn",
      "Bright Front Light",
      "Odometer",
      "Optimized Frame Design",
    ],
    price: 25000,
    priceNote: "incl. tax",
    advanceAmount: 5000,
    imageUrl: "/images/products/x-variant.png",
    inStock: true,
  },
];

/**
 * Look up a single product by its slug ID.
 *
 * TODO(backend): replace body with:
 *   const res = await fetch(`/api/products/${id}`);
 *   if (!res.ok) return undefined;
 *   return res.json() as Promise<Product>;
 */
export function getProduct(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}
