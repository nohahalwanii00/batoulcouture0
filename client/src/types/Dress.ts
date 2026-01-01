export interface Dress {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  images: Array<{
    url: string;
    alt: string;
    isMain?: boolean;
  }>;
  category: string;
  size: string[];
  color: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  specifications?: {
    material: string;
    length: string;
    neckline: string;
    sleeve: string;
    occasion: string;
    care: string;
  };
  material?: string;
  careInstructions?: string;
  availability?: 'limited' | 'in-stock' | 'out-of-stock';
  createdAt?: string;
  updatedAt?: string;
}