"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CAROUSEL_SLIDES } from "@/data/seed";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % CAROUSEL_SLIDES.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const slide = CAROUSEL_SLIDES[index];

  return (
    <section className="hero-carousel" aria-label="Destaques da loja">
      {CAROUSEL_SLIDES.map((item, i) => (
        <div
          key={item.title}
          className={`hero-slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${item.image})` }}
          aria-hidden={i !== index}
        />
      ))}

      <div className="hero-overlay">
        <div className="hero-content">
          <p className="brand-hero">Estilo & Moda</p>
          <h1 key={slide.title} className="hero-title">
            {slide.title}
          </h1>
          <p key={slide.subtitle} className="hero-subtitle">
            {slide.subtitle}
          </p>
          <div className="hero-actions">
            <Link href={slide.href} className="btn btn-primary">
              {slide.cta}
            </Link>
            <Link href="/contato" className="btn btn-light">
              Fale conosco
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-controls">
        <button
          type="button"
          aria-label="Slide anterior"
          onClick={() =>
            setIndex((current) =>
              current === 0 ? CAROUSEL_SLIDES.length - 1 : current - 1
            )
          }
        >
          ‹
        </button>
        <div className="hero-dots">
          {CAROUSEL_SLIDES.map((item, i) => (
            <button
              key={item.title}
              type="button"
              className={i === index ? "active" : undefined}
              aria-label={`Ir para slide ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Próximo slide"
          onClick={() => setIndex((current) => (current + 1) % CAROUSEL_SLIDES.length)}
        >
          ›
        </button>
      </div>
    </section>
  );
}
