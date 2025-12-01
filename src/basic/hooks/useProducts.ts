// TODO: 상품 관리 Hook
// 힌트:
// 1. 상품 목록 상태 관리 (localStorage 연동 고려)
// 2. 상품 CRUD 작업
// 3. 재고 업데이트
// 4. 할인 규칙 추가/삭제
//
// 반환할 값:
// - products: 상품 배열
// - updateProduct: 상품 정보 수정
// - addProduct: 새 상품 추가
// - updateProductStock: 재고 수정
// - addProductDiscount: 할인 규칙 추가
// - removeProductDiscount: 할인 규칙 삭제

import { Discount, Product } from '../../types';
import { initialProducts } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useProducts() {
  // 1. 상품 목록 상태 관리 (localStorage 연동)
  const [products, setProducts] = useLocalStorage<Product[]>(
    'products',
    initialProducts
  );

  // 2. 상품 CRUD 작업

  // addProduct: 새 상품 추가
  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  // updateProduct: 상품 정보 수정
  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  // deleteProduct: 상품 삭제
  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  // 3. 재고 업데이트
  const updateProductStock = (productId: string, stock: number) => {
    updateProduct(productId, { stock });
  };

  // 4. 할인 규칙 추가/삭제
  const addProductDiscount = (productId: string, discount: Discount) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, discounts: [...product.discounts, discount] }
          : product
      )
    );
  };

  const removeProductDiscount = (productId: string, discountIndex: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              discounts: product.discounts.filter(
                (_, index) => index !== discountIndex
              ),
            }
          : product
      )
    );
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  };
}
