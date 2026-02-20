export interface ProductVariant {
  optionValues: string[];
  price: number;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface BusinessProduct {
  productId: string;
  imageUrl: string | null;
  productName: string;
  productDescription: string | null;
  productCategoryId: string | null;
  variants: ProductVariant[] | null;
  options: ProductOption[] | null;
  price: number;
}

export interface BusinessProductCategory {
  productCategoryId: string;
  title: string;
  numberOfProductCount: number;
}

export interface BusinessProductsData {
  products: {
    data: BusinessProduct[];
    numberOfPages: number;
    numberOfItems: number;
  };
  categories: BusinessProductCategory[] | null;
}

export interface BusinessProductsResponse {
  message: string;
  status: string;
  data: BusinessProductsData;
  success: boolean;
}

export interface BusinessProductsQuery {
  businessId: string;
  page?: number;
  size?: number;
  search?: string;
}