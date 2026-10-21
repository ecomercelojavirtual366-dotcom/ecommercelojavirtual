"use client";

import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductsContext";

type ProductGridProps = {
  limit?: number;
  title?: string;
  subtitle?: string;
};

export function ProductGrid({ limit, title, subtitle }: ProductGridProps) {
  const { products, loading, error } = useProducts();
  const visible = products
    .filter((product) => product.active)
    .slice(0, limit ?? products.length);

  return (
    <section className="section">
      <div className="container">
        {(title || subtitle) && (
          <div className="section-heading">
            {title && <h2>{title}</h2>}
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
        )}

        {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}

        {loading ? (
          <p className="muted">Carregando produtos...</p>
        ) : visible.length === 0 ? (
          <p className="muted">
            Nenhum produto disponível no momento. Se o Firebase estiver conectado,
            entre em /admin e cadastre ou popule os produtos iniciais.
          </p>
        ) : (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
