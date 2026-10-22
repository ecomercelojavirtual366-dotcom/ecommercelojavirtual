import type { Product } from "@/lib/types";

export const SEED_PRODUCTS: Omit<Product, "id" | "createdAt">[] = [
  {
    name: "Vestido Floral Midi",
    description: "Vestido fluido com estampa floral suave, ideal para o dia a dia e ocasiões leves.",
    price: 129.9,
    image:
      "https://images.unsplash.com/photo-1602010069450-0a62034f235c?q=80&w=1200&auto=format&fit=crop",
    category: "Vestidos",
    active: true,
  },
  {
    name: "Blusa Estilosa",
    description: "Blusa leve com caimento moderno e detalhes delicados.",
    price: 89.9,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
    category: "Blusas",
    active: true,
  },
  {
    name: "Calça Jeans Premium",
    description: "Jeans de cintura alta com modelagem confortável e acabamento premium.",
    price: 149.9,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
    category: "Calças",
    active: true,
  },
  {
    name: "Saia Plissada",
    description: "Saia plissada elegante, perfeita para looks casuais ou de trabalho.",
    price: 119.9,
    image:
      "https://images.unsplash.com/photo-1533659828870-95ee305cee3e?q=80&w=1200&auto=format&fit=crop",
    category: "Saias",
    active: true,
  },
  {
    name: "Casaco Oversized",
    description: "Casaco estruturado com visual contemporâneo para dias mais frios.",
    price: 219.9,
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop",
    category: "Casacos",
    active: true,
  },
  {
    name: "Conjunto Minimal",
    description: "Conjunto coordenado em tom neutro para um visual clean e sofisticado.",
    price: 189.9,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    category: "Conjuntos",
    active: true,
  },
];

export const CAROUSEL_SLIDES = [
  {
    title: "Nova coleção primavera",
    subtitle: "Peças leves, elegantes e prontas para o seu dia a dia.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    cta: "Ver coleção",
    href: "/colecao",
  },
  {
    title: "Essenciais femininos",
    subtitle: "Blusas, vestidos e calças com acabamento de boutique.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
    cta: "Explorar peças",
    href: "/colecao",
  },
  {
    title: "Looks para todas as ocasiões",
    subtitle: "Do casual ao sofisticado, com frete simulado e compra mockada.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    cta: "Comprar agora",
    href: "/colecao",
  },
];
