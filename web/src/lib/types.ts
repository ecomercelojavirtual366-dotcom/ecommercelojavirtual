export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  active: boolean;
  createdAt: number;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: "mock_pago" | "pendente";
  createdAt: number;
};

export type AppUser = {
  uid: string;
  email: string;
  name: string;
  isAdmin: boolean;
};
