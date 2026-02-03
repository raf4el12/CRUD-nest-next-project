/**
 * Admin Feature - Public API
 * 
 * This feature is a composition layer that imports from other features
 * and provides the admin shell (layout components) and views.
 */

// Layout Components (Shell)
export { Sidebar } from './components/Sidebar';
export { Header } from './components/Header';
export { UserNav } from './components/UserNav';

// Views (Compositions that import from other features)
export { AdminDashboardView } from './views/AdminDashboardView';
export { AdminProductsView } from './views/AdminProductsView';
export { CategoriesView } from './views/CategoriesView';
