import { notFound } from "next/navigation";
import { getProduct, MOCK_PRODUCTS } from "@/lib/mock-products";
import ProductDetailClient from "@/components/products/ProductDetailClient";

// Pre-generate static params for both products at build time
export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

// Page-level metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const product = getProduct(params.id);
  if (!product) return { title: "Product Not Found | SEMY" };
  return {
    title: `${product.name} | SEMY Electric`,
    description: `${product.name} — ${product.battery}, ${product.motor}. Range ${product.rangeKm} km. Book with ₹${product.advanceAmount} advance.`,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = getProduct(params.id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
