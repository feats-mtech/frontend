import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { useAuth } from 'src/context/AuthContext';

export const HomePage = lazy(() => import('src/pages/home'));
export const InventoryPage = lazy(() => import('src/pages/inventory'));
export const InventoryCreatePage = lazy(() => import('src/pages/inventory-create'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const RecipesPage = lazy(() => import('src/pages/recipes'));
export const RecipeDetailsPage = lazy(() => import('src/pages/recipe-details'));
export const MyRecipesPage = lazy(() => import('src/pages/my-recipes'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  const { isAuthenticated } = useAuth();
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            {isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />}
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'inventory', element: <InventoryPage /> },
        { path: 'inventory/new', element: <InventoryCreatePage /> },
        { path: 'recipes', element: <RecipesPage /> },
        { path: 'recipes/details/:inputRecipeId', element: <RecipeDetailsPage /> },
        { path: 'my-recipes', element: <MyRecipesPage /> },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
