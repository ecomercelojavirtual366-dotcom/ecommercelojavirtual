"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatBRL, formatDate } from "@/lib/format";

export default function PedidosPage() {
  const { user, loading } = useAuth();
  const { orders, refreshOrders } = useCart();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders, user]);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="muted">Carregando...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Histórico</p>
        <h1 className="page-title">Meus pedidos</h1>

        {!user ? (
          <div className="panel">
            <p className="muted">
              Entre na sua conta para visualizar os pedidos mockados.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "1rem" }}
              onClick={() => setAuthOpen(true)}
            >
              Entrar / Cadastrar
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="panel">
            <p className="muted">Você ainda não possui pedidos.</p>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <article key={order.id} className="order-item panel" style={{ display: "block" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>Pedido #{order.id}</strong>
                    <p className="muted" style={{ margin: "0.25rem 0 0" }}>
                      {formatDate(order.createdAt)} · status {order.status}
                    </p>
                  </div>
                  <strong>{formatBRL(order.total)}</strong>
                </div>
                <p style={{ margin: "0.85rem 0 0", color: "var(--muted)" }}>
                  {order.items
                    .map((item) => `${item.name} (x${item.quantity})`)
                    .join(" · ")}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
