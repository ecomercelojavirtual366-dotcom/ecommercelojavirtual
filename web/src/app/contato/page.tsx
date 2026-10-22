"use client";

import { FormEvent, useState } from "react";

export default function ContatoPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <section className="section">
      <div className="container contact-layout">
        <div>
          <p className="eyebrow">Atendimento</p>
          <h1 className="page-title">Fale com a Estilo & Moda</h1>
          <p className="muted" style={{ maxWidth: 480 }}>
            Envie uma mensagem sobre pedidos, trocas ou sugestões. Neste MVP o
            envio é simulado e não dispara e-mail real.
          </p>
        </div>

        <form className="panel stack-form" onSubmit={handleSubmit}>
          <label>
            Nome
            <input name="nome" required placeholder="Seu nome" />
          </label>
          <label>
            E-mail
            <input type="email" name="email" required placeholder="voce@email.com" />
          </label>
          <label>
            Mensagem
            <textarea name="mensagem" required placeholder="Como podemos ajudar?" />
          </label>
          <button type="submit" className="btn btn-primary">
            Enviar mensagem
          </button>
          {sent && <p className="form-success">Mensagem enviada com sucesso (simulação).</p>}
        </form>
      </div>
    </section>
  );
}
