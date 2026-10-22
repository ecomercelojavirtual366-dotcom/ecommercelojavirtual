import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong className="footer-brand">Estilo & Moda</strong>
          <p>Loja feminina online — MVP acadêmico com compra simulada.</p>
        </div>
        <div className="footer-links">
          <Link href="/colecao">Coleção</Link>
          <Link href="/pedidos">Meus pedidos</Link>
          <Link href="/contato">Contato</Link>
          <Link href="/admin">Área admin</Link>
        </div>
      </div>
      <p className="footer-copy">© 2026 Estilo & Moda</p>
    </footer>
  );
}
