"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/format";

export default function CarrinhoPage() {
  const { user } = useAuth();
  const { items, total, updateQuantity, removeItem, clearCart, checkout } = useCart();
  const [authOpen, setAuthOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setError("");
    setMessage("");
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setLoading(true);
    try {
      const order = await checkout();
      setMessage(`Compra mockada com sucesso! Pedido ${order.id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao finalizar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Carrinho</p>
        <h1 className="page-title">Seu carrinho</h1>

        {items.length === 0 ? (
          <div className="panel">
            <p className="muted">Seu carrinho está vazio.</p>
            {message && <p className="form-success">{message}</p>}
            <Link href="/colecao" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Ver coleção
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <article key={item.productId} className="cart-item">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={88}
                    height={88}
                    unoptimized
                  />
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem", fontFamily: "var(--font-display)" }}>
                      {item.name}
                    </h3>
                    <p className="muted" style={{ margin: 0 }}>
                      {formatBRL(item.price)} cada
                    </p>
                  </div>
                  <div style={{ display: "grid", gap: "0.5rem", justifyItems: "end" }}>
                    <strong>{formatBRL(item.price * item.quantity)}</strong>
                    <div className="qty-controls">
                      <button type="button" onClick={() => updateQuantity(item.productId, -1)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, 1)}>
                        +
                      </button>
                      <button type="button" onClick={() => removeItem(item.productId)}>
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="panel cart-summary">
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)" }}>Resumo</h2>
              <p className="muted" style={{ margin: 0 }}>
                Pagamento simulado para demonstração do TCC.
              </p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total</span>
                <strong>{formatBRL(total)}</strong>
              </div>
              {error && <p className="form-error">{error}</p>}
              {message && <p className="form-success">{message}</p>}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processando..." : "Finalizar compra (mock)"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={clearCart}>
                Limpar carrinho
              </button>
              {!user && (
                <p className="tiny muted">
                  Você precisa estar logada para finalizar. O cadastro também é
                  pedido ao adicionar produtos.
                </p>
              )}
            </aside>
          </div>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        message="Entre ou cadastre-se para finalizar a compra mockada."
      />
    </section>
  );
}
