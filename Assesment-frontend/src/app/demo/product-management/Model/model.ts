export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  CategoryId: string;
  category?: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  } | null;

  categoryName?: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}
