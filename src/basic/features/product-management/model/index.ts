import { useState, useCallback } from 'react';
import { ProductWithUI, initialProducts } from '../../../shared/config';
import { useLocalStorage } from '../../../shared/lib/useLocalStorage';

export type ProductFormData = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

const initialProductForm: ProductFormData = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
};

export function useProductManagement(
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void
) {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    initialProducts
  );
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormData>(initialProductForm);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification, setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification, setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification, setProducts]
  );

  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingProduct && editingProduct !== 'new') {
        updateProduct(editingProduct, productForm);
        setEditingProduct(null);
      } else {
        addProduct({
          ...productForm,
          discounts: productForm.discounts,
        });
      }
      setProductForm(initialProductForm);
      setEditingProduct(null);
      setShowProductForm(false);
    },
    [editingProduct, productForm, updateProduct, addProduct]
  );

  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  }, []);

  return {
    // 상태
    products,
    editingProduct,
    showProductForm,
    productForm,
    // 상태 변경
    setEditingProduct,
    setShowProductForm,
    setProductForm,
    // 액션
    handleProductSubmit,
    startEditProduct,
    deleteProduct,
  };
}
