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
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { SEED_PRODUCTS } from "@/data/seed";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { readJson, writeJson } from "@/lib/localStore";
import type { Product } from "@/lib/types";

type ProductInput = Omit<Product, "id" | "createdAt">;

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  usingFirebase: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  seedInitialProducts: () => Promise<void>;
  createProduct: (input: ProductInput) => Promise<void>;
  updateProduct: (id: string, input: ProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);
const PRODUCTS_KEY = "em_products";

function buildSeedProducts(): Product[] {
  const now = Date.now();
  return SEED_PRODUCTS.map((item, index) => ({
    ...item,
    id: `seed_${index + 1}`,
    createdAt: now - index * 1000,
  }));
}

function mapProductDocs(docs: Array<{ id: string; data: () => unknown }>): Product[] {
  return docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Product, "id">),
  }));
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const usingFirebase = isFirebaseConfigured();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (usingFirebase) {
        const db = getFirebaseDb();
        if (!db) return;

        try {
          const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
          const snap = await getDocs(q);
          setProducts(mapProductDocs(snap.docs));
        } catch {
          // Sem índice ou falha no orderBy: tenta leitura simples.
          try {
            const snap = await getDocs(collection(db, "products"));
            setProducts(
              mapProductDocs(snap.docs).sort((a, b) => b.createdAt - a.createdAt)
            );
          } catch (inner) {
            const message =
              inner instanceof Error ? inner.message : "Erro ao ler produtos.";
            if (message.toLowerCase().includes("permission")) {
              setError(
                "Firestore bloqueou a leitura. Publique as regras em firestore.rules (allow read em /products)."
              );
            } else {
              setError(message);
            }
            setProducts([]);
          }
        }
        return;
      }

      let local = readJson<Product[]>(PRODUCTS_KEY, []);
      if (local.length === 0) {
        local = buildSeedProducts();
        writeJson(PRODUCTS_KEY, local);
      }
      setProducts(local.sort((a, b) => b.createdAt - a.createdAt));
    } finally {
      setLoading(false);
    }
  }, [usingFirebase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const seedInitialProducts = useCallback(async () => {
    if (!usingFirebase) {
      const local = buildSeedProducts();
      writeJson(PRODUCTS_KEY, local);
      setProducts(local);
      return;
    }

    const db = getFirebaseDb();
    if (!db) throw new Error("Firestore indisponível.");

    const snap = await getDocs(collection(db, "products"));
    if (!snap.empty) {
      throw new Error("Já existem produtos no Firestore.");
    }

    for (const product of buildSeedProducts()) {
      const { id: _id, ...payload } = product;
      await addDoc(collection(db, "products"), payload);
    }
    await refresh();
  }, [usingFirebase, refresh]);

  const createProduct = useCallback(
    async (input: ProductInput) => {
      const payload = { ...input, createdAt: Date.now() };
      if (usingFirebase) {
        const db = getFirebaseDb();
        if (!db) throw new Error("Firestore indisponível.");
        await addDoc(collection(db, "products"), payload);
        await refresh();
        return;
      }
      const next: Product = { ...payload, id: `local_${Date.now()}` };
      const list = [next, ...readJson<Product[]>(PRODUCTS_KEY, [])];
      writeJson(PRODUCTS_KEY, list);
      setProducts(list);
    },
    [usingFirebase, refresh]
  );

  const updateProduct = useCallback(
    async (id: string, input: ProductInput) => {
      if (usingFirebase) {
        const db = getFirebaseDb();
        if (!db) throw new Error("Firestore indisponível.");
        const current = products.find((item) => item.id === id);
        await updateDoc(doc(db, "products", id), {
          ...input,
          createdAt: current?.createdAt ?? Date.now(),
        });
        await refresh();
        return;
      }
      const list = readJson<Product[]>(PRODUCTS_KEY, []).map((item) =>
        item.id === id ? { ...item, ...input } : item
      );
      writeJson(PRODUCTS_KEY, list);
      setProducts(list.sort((a, b) => b.createdAt - a.createdAt));
    },
    [usingFirebase, products, refresh]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (usingFirebase) {
        const db = getFirebaseDb();
        if (!db) throw new Error("Firestore indisponível.");
        await deleteDoc(doc(db, "products", id));
        await refresh();
        return;
      }
      const list = readJson<Product[]>(PRODUCTS_KEY, []).filter(
        (item) => item.id !== id
      );
      writeJson(PRODUCTS_KEY, list);
      setProducts(list);
    },
    [usingFirebase, refresh]
  );

  const value = useMemo(
    () => ({
      products,
      loading,
      usingFirebase,
      error,
      refresh,
      seedInitialProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      products,
      loading,
      usingFirebase,
      error,
      refresh,
      seedInitialProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    ]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  }
  return ctx;
}
