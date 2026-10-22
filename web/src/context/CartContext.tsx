"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { readJson, writeJson } from "@/lib/localStore";
import type { CartItem, Order, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  orders: Order[];
  addProduct: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<Order>;
  refreshOrders: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "em_cart";
const ORDERS_KEY = "em_orders";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setItems(readJson<CartItem[]>(CART_KEY, []));
  }, []);

  useEffect(() => {
    writeJson(CART_KEY, items);
  }, [items]);

  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    const mapOrders = (
      docs: Array<{ id: string; data: () => unknown }>
    ): Order[] =>
      docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Order, "id">),
      }));

    if (isFirebaseConfigured()) {
      const db = getFirebaseDb();
      if (!db) return;

      if (user.isAdmin) {
        try {
          const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
          const snap = await getDocs(q);
          setOrders(mapOrders(snap.docs));
        } catch {
          try {
            const snap = await getDocs(collection(db, "orders"));
            setOrders(
              mapOrders(snap.docs).sort((a, b) => b.createdAt - a.createdAt)
            );
          } catch {
            setOrders([]);
          }
        }
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setOrders(mapOrders(snap.docs));
      } catch {
        try {
          const simple = query(
            collection(db, "orders"),
            where("userId", "==", user.uid)
          );
          const snap = await getDocs(simple);
          setOrders(
            mapOrders(snap.docs).sort((a, b) => b.createdAt - a.createdAt)
          );
        } catch {
          setOrders([]);
        }
      }
      return;
    }

    const all = readJson<Order[]>(ORDERS_KEY, []);
    const filtered = user.isAdmin
      ? all
      : all.filter((order) => order.userId === user.uid);
    setOrders(filtered.sort((a, b) => b.createdAt - a.createdAt));
  }, [user]);

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  const addProduct = useCallback((product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const checkout = useCallback(async () => {
    if (!user) throw new Error("Faça login para finalizar a compra.");
    if (items.length === 0) throw new Error("Seu carrinho está vazio.");

    const order: Order = {
      id: `pedido_${Date.now()}`,
      userId: user.uid,
      userEmail: user.email,
      items: items.map((item) => ({ ...item })),
      total,
      status: "mock_pago",
      createdAt: Date.now(),
    };

    if (isFirebaseConfigured()) {
      const db = getFirebaseDb();
      if (!db) throw new Error("Firestore indisponível.");
      const { id: _ignored, ...payload } = order;
      const ref = await addDoc(collection(db, "orders"), payload);
      order.id = ref.id;
    } else {
      const all = readJson<Order[]>(ORDERS_KEY, []);
      all.push(order);
      writeJson(ORDERS_KEY, all);
    }

    setItems([]);
    await refreshOrders();
    return order;
  }, [user, items, total, refreshOrders]);

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      orders,
      addProduct,
      updateQuantity,
      removeItem,
      clearCart,
      checkout,
      refreshOrders,
    }),
    [
      items,
      count,
      total,
      orders,
      addProduct,
      updateQuantity,
      removeItem,
      clearCart,
      checkout,
      refreshOrders,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
