/**
 * Auth Feature - Public API
 * 
 * This file exports the public interface of the auth feature.
 * Other features should only import from this barrel file.
 */

// Context & Hook
export { AuthProvider, useAuth } from './context/auth-context';

// Components
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';

// Services
export { authService } from './services/auth.service';

// Types
export type { User, Profile, LoginDto, RegisterDto, LoginResponse } from './types';
