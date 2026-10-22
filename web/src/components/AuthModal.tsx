"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  message?: string;
};

export function AuthModal({ open, onClose, onSuccess, message }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível continuar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <p className="eyebrow">Conta</p>
        <h2>{mode === "login" ? "Entrar" : "Criar cadastro"}</h2>
        <p className="muted">
          {message ||
            "Para adicionar produtos ao carrinho, é necessário ter uma conta."}
        </p>

        <form className="stack-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Nome
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Seu nome"
              />
            </label>
          )}
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="voce@email.com"
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting
              ? "Aguarde..."
              : mode === "login"
                ? "Entrar"
                : "Cadastrar e continuar"}
          </button>
        </form>

        <button
          type="button"
          className="text-link"
          onClick={() => {
            setError("");
            setMode((current) => (current === "login" ? "register" : "login"));
          }}
        >
          {mode === "login"
            ? "Não tem conta? Cadastre-se"
            : "Já tem conta? Entrar"}
        </button>

        <p className="tiny muted">
          Conta admin: ecomercelojavirtual366@gmail.com (já cadastrada no Firebase).
        </p>
      </div>
    </div>
  );
}
