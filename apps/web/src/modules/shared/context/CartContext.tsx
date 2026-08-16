"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  totalAdvance: number;
  /** Whether the cart drawer is open */
  isDrawerOpen: boolean;
  /** Incremented every time an item is added — used to trigger animations */
  addPulse: number;
  addToCart: (product: Product, quantity: number, color: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const STORAGE_KEY = "semy_cart";

// ── Context ────────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ── Helpers ────────────────────────────────────────────────────────────────────

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

// ── Provider ───────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [addPulse, setAddPulse] = useState(0);
  const hydrated = useRef(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(loadFromStorage());
    hydrated.current = true;
  }, []);

  // Persist to localStorage on every change (skip first hydration)
  useEffect(() => {
    if (hydrated.current) {
      saveToStorage(items);
    }
  }, [items]);

  const addToCart = useCallback(
    (product: Product, quantity: number, color: string) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.product.id === product.id && i.selectedColor === color
        );
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id && i.selectedColor === color
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { product, quantity, selectedColor: color }];
      });
      setAddPulse((p) => p + 1);
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const totalAdvance = items.reduce(
    (sum, i) => sum + (i.product.advanceAmount || 5000) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        totalAdvance,
        isDrawerOpen,
        addPulse,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}
