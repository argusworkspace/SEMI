import { notFound } from "next/navigation";
import { getProduct, MOCK_PRODUCTS } from "@/lib/mock-products";
import ProductDetailClient from "@/modules/products/components/ProductDetailClient";

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "Product Not Found | SEMY" };
  return {
    title: `${product.name} | SEMY Electric`,
    description: `${product.name} — ${product.battery}, ${product.motor}. Range ${product.rangeKm} km. Book with ₹${product.advanceAmount} advance.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
