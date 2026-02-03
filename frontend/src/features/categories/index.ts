/**
 * Categories Feature - Public API
 * 
 * This file exports the public interface of the categories feature.
 * Other features should only import from this barrel file.
 */

// Components
export { CategoriesTable } from './components/CategoriesTable';
export { CategoriesToolbar } from './components/CategoriesToolbar';
export { CategoryAddDrawer } from './components/CategoryAddDrawer';
export { CategoryEditDrawer } from './components/CategoryEditDrawer';
export { CategoryCards } from './components/CategoryCards';
export { CategoryDetailPanel } from './components/CategoryDetailPanel';

// Hooks
export { useCategoryAddHook } from './hooks/useCategoryAddHook';
export { useCategoryEditHook } from './hooks/useCategoryEditHook';

// Services
export { categoriesService, fetchCategoriesPagination } from './services/categories.service';

// Types
export type { Category } from './types';
export type { CategoryFormValues } from './validators/category';
export { categorySchema } from './validators/category';
