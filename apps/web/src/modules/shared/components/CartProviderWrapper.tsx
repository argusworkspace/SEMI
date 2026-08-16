"use client";

import { CartProvider } from "@/modules/shared/context/CartContext";
import FloatingCart from "@/modules/shared/components/FloatingCart";
import CartDrawer from "@/modules/shared/components/CartDrawer";

/**
 * Client-side wrapper that provides cart context + renders
 * the floating cart icon and cart drawer globally.
 *
 * This is a separate component because <CartProvider> needs
 * "use client", but the root layout should remain a Server Component.
 */
export default function CartProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      <FloatingCart />
      <CartDrawer />
    </CartProvider>
  );
}
