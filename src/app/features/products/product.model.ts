export interface Product {
  _id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductApiResponse {
  success: boolean;
  data: Product;
}

export interface ProductsApiResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 