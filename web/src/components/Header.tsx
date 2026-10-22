"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const links = useMemo(() => {
    if (user?.isAdmin) {
      return [
        { href: "/", label: "Home" },
        { href: "/colecao", label: "Coleção" },
        { href: "/pedidos", label: "Pedidos" },
        { href: "/admin", label: "Admin" },
      ];
    }

    return [
      { href: "/", label: "Home" },
      { href: "/colecao", label: "Coleção" },
      { href: "/carrinho", label: "Carrinho" },
      { href: "/pedidos", label: "Pedidos" },
      { href: "/contato", label: "Contato" },
    ];
  }, [user?.isAdmin]);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">EM</span>
            <span className="brand-text">
              <strong>Estilo & Moda</strong>
              <small>Boutique feminina</small>
            </span>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {link.href === "/carrinho" && count > 0 && (
                  <span className="badge">{count}</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            {user ? (
              <>
                <span className="user-chip">{user.name.split(" ")[0]}</span>
                <button type="button" className="btn btn-ghost" onClick={() => logout()}>
                  Sair
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setAuthOpen(true)}
              >
                Entrar
              </button>
            )}
            {!user?.isAdmin && (
              <Link href="/carrinho" className="btn btn-primary cart-btn">
                Carrinho
                {count > 0 && <span className="badge">{count}</span>}
              </Link>
            )}
            {user?.isAdmin && (
              <Link href="/admin" className="btn btn-primary">
                Painel
              </Link>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
