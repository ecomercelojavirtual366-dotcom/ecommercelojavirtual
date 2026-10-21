"use client";

import Image from "next/image";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { addProduct } = useCart();
  const [authOpen, setAuthOpen] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    addProduct(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <>
      <article className="product-card">
        <div className="product-media">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="product-image"
          />
          <span className="product-tag">{product.category}</span>
        </div>
        <div className="product-body">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div className="product-footer">
            <strong>{formatBRL(product.price)}</strong>
            <button type="button" className="btn btn-primary" onClick={handleAdd}>
              {added ? "Adicionado" : "Adicionar"}
            </button>
          </div>
        </div>
      </article>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        message="Cadastre-se ou entre para adicionar este produto ao carrinho."
        onSuccess={() => {
          addProduct(product);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1400);
        }}
      />
    </>
  );
}
