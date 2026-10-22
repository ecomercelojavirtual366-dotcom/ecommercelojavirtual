"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductsContext";
import { formatBRL } from "@/lib/format";
import { uploadProductImage } from "@/lib/uploadImage";
import type { Product } from "@/lib/types";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "Vestidos",
  active: true,
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    products,
    loading,
    usingFirebase,
    error: productsError,
    createProduct,
    updateProduct,
    deleteProduct,
    seedInitialProducts,
  } = useProducts();
  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sorted = useMemo(
    () => [...products].sort((a, b) => b.createdAt - a.createdAt),
    [products]
  );

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category,
      active: product.active,
    });
    setSuccess("");
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleImageFile(file?: File | null) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm((prev) => ({ ...prev, image: url }));
      setSuccess("Imagem pronta para o cadastro.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload da imagem.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const price = Number(form.price.replace(",", "."));
    if (!form.name.trim() || !form.image.trim() || Number.isNaN(price) || price <= 0) {
      setError("Preencha nome, imagem e um preço válido.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        image: form.image.trim(),
        category: form.category.trim() || "Geral",
        active: form.active,
      };
      if (editingId) {
        await updateProduct(editingId, payload);
        setSuccess("Produto atualizado.");
      } else {
        await createProduct(payload);
        setSuccess("Produto cadastrado.");
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar produto.");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return (
      <section className="section">
        <div className="container">
          <p className="muted">Carregando...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="container panel">
          <p className="eyebrow">Administração</p>
          <h1 className="page-title">Área restrita</h1>
          <p className="muted">
            Faça login com uma conta de administrador para cadastrar produtos e
            preços.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
            onClick={() => setAuthOpen(true)}
          >
            Entrar
          </button>
          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
      </section>
    );
  }

  if (!user.isAdmin) {
    return (
      <section className="section">
        <div className="container panel">
          <h1 className="page-title">Acesso negado</h1>
          <p className="muted">
            Sua conta ({user.email}) não está na lista de administradores.
            Use ecomercelojavirtual366@gmail.com ou atualize NEXT_PUBLIC_ADMIN_EMAILS.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <p className="eyebrow">Painel</p>
            <h1 className="page-title">Administração de produtos</h1>
            <p className="muted">
              Cadastre, edite preços e gerencie a vitrine da loja.
            </p>
          </div>
          <span className="mode-pill">
            {usingFirebase ? "Firebase conectado" : "Modo local (demo)"}
          </span>
        </div>

        {productsError && (
          <p className="form-error" style={{ marginBottom: "1rem" }}>
            {productsError}
          </p>
        )}

        {usingFirebase && products.length === 0 && !loading && (
          <div className="panel" style={{ marginBottom: "1.25rem" }}>
            <p className="muted" style={{ margin: "0 0 0.75rem" }}>
              Nenhum produto no Firestore. Publique as regras e depois popule os
              produtos iniciais (exige login admin).
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                setError("");
                setSuccess("");
                try {
                  await seedInitialProducts();
                  setSuccess("Produtos iniciais cadastrados no Firebase.");
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Não foi possível popular os produtos."
                  );
                }
              }}
            >
              Popular produtos iniciais
            </button>
          </div>
        )}

        <div className="admin-layout">
          <form className="panel admin-form" onSubmit={handleSubmit}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)" }}>
              {editingId ? "Editar produto" : "Novo produto"}
            </h2>
            <label>
              Nome
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
            <label>
              Descrição
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </label>
            <label>
              Preço (R$)
              <input
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="129.90"
                required
              />
            </label>
            <label>
              Categoria
              <input
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </label>
            <label>
              Enviar imagem do computador
              <input
                type="file"
                accept="image/*"
                disabled={uploading || saving}
                onChange={(e) => {
                  void handleImageFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <label>
              Ou URL da imagem
              <input
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://... ou upload acima"
                required
              />
            </label>
            {form.image && (
              <div className="panel" style={{ padding: "0.75rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="Pré-visualização"
                  style={{
                    width: "100%",
                    maxHeight: 220,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              </div>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, active: e.target.checked }))
                }
                style={{ width: "auto" }}
              />
              Produto ativo na loja
            </label>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            {uploading && <p className="muted">Enviando imagem...</p>}

            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || uploading}
              >
                {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar"}
              </button>
              {editingId && (
                <button type="button" className="btn btn-ghost" onClick={resetForm}>
                  Cancelar edição
                </button>
              )}
            </div>
          </form>

          <div className="admin-list">
            {loading ? (
              <p className="muted">Carregando produtos...</p>
            ) : (
              sorted.map((product) => (
                <article key={product.id} className="admin-item">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={72}
                    height={72}
                    unoptimized
                  />
                  <div>
                    <strong>{product.name}</strong>
                    <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                      {formatBRL(product.price)} · {product.category} ·{" "}
                      {product.active ? "ativo" : "inativo"}
                    </p>
                  </div>
                  <div className="admin-actions">
                    <button type="button" onClick={() => startEdit(product)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      style={{ color: "white", border: 0 }}
                      onClick={() => {
                        if (confirm(`Remover ${product.name}?`)) {
                          void deleteProduct(product.id);
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
