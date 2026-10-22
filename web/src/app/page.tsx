import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductGrid } from "@/components/ProductGrid";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      <div className="container">
        <div className="feature-strip">
          <article className="feature-item">
            <h3>Catálogo aberto</h3>
            <p>Qualquer visitante pode navegar e visualizar preços e detalhes.</p>
          </article>
          <article className="feature-item">
            <h3>Carrinho com cadastro</h3>
            <p>O login só é solicitado no momento de adicionar um produto.</p>
          </article>
          <article className="feature-item">
            <h3>Compra simulada</h3>
            <p>Checkout mockado para demonstração acadêmica do TCC.</p>
          </article>
        </div>
      </div>

      <ProductGrid
        limit={3}
        title="Destaques da semana"
        subtitle="Uma seleção da coleção feminina para começar a explorar a loja."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container panel" style={{ textAlign: "center" }}>
          <p className="eyebrow">Coleção completa</p>
          <h2 className="page-title">Pronto para montar o look?</h2>
          <p className="muted" style={{ maxWidth: 520, margin: "0 auto 1.25rem" }}>
            Veja todas as peças disponíveis, adicione ao carrinho após o cadastro e
            finalize com pagamento simulado.
          </p>
          <Link href="/colecao" className="btn btn-primary">
            Ir para a coleção
          </Link>
        </div>
      </section>
    </>
  );
}
