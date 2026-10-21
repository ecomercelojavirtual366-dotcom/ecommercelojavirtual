import { ProductGrid } from "@/components/ProductGrid";

export default function ColecaoPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <p className="eyebrow">Catálogo</p>
          <h1 className="page-title">Nossa coleção</h1>
          <p className="muted" style={{ maxWidth: 560 }}>
            Todos podem visualizar os produtos. O cadastro é solicitado apenas ao
            adicionar um item ao carrinho.
          </p>
        </div>
      </section>
      <ProductGrid />
    </>
  );
}
