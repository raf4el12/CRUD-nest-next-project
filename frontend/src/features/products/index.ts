/**
 * Products Feature - Public API
 * 
 * This file exports the public interface of the products feature.
 * Other features should only import from this barrel file.
 */

// Components
export { ProductsTable } from './components/ProductsTable';
export { ProductsToolbar } from './components/ProductsToolbar';
export { ProductAddDrawer } from './components/ProductAddDrawer';
export { ProductEditDrawer } from './components/ProductEditDrawer';
export { ProductDetailPanel } from './components/ProductDetailPanel';

// Hooks
export { useProductAddHook } from './hooks/useProductAddHook';
export { useProductEditHook } from './hooks/useProductEditHook';

// Services
export { productsService, fetchProductsPagination } from './services/products.service';

// Types
export type { Product } from './types';
export type { ProductFormValues } from './validators/product';
export { productBaseSchema, productCreateSchema, productEditSchema } from './validators/product';
