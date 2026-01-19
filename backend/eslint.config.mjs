// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
{
    rules: {
      // PERMITE el uso de 'any' (ya lo tienes, está bien)
      '@typescript-eslint/no-explicit-any': 'off',
      
      // CAMBIA ERRORES A ADVERTENCIAS (Amarillo en lugar de Rojo)
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // 🔴 AQUÍ ESTÁ EL CAMBIO IMPORTANTE PARA PRETTIER 🔴
      // Cambia "error" por "warn" para que salga amarillo, 
      // o "off" para que no salga nada.
      "prettier/prettier": ["warn", { endOfLine: "auto" }],

      // AGREGADO: Para que las variables no usadas no sean error rojo
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
);
