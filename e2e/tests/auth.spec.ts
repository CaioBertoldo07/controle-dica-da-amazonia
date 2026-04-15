import { test, expect } from '@playwright/test';

/**
 * Auth E2E tests.
 * Prerequisites: frontend on :5173, backend on :3333 with a seeded admin user.
 * Default admin credentials (from seed): admin@dicadaamazonia.com / admin123
 * Adjust ADMIN_EMAIL / ADMIN_PASSWORD if your seed differs.
 */

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'admin@dicadaamazonia.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'admin123';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows login page at /login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Dica da Amazônia')).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/senha/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });

  test('redirects to /login when accessing protected route unauthenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects to /login when accessing /pedidos unauthenticated', async ({ page }) => {
    await page.goto('/pedidos');
    await expect(page).toHaveURL(/\/login/);
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /entrar/i }).click();
    await expect(page.getByText(/email é obrigatório/i)).toBeVisible();
    await expect(page.getByText(/senha é obrigatória/i)).toBeVisible();
  });

  test('shows error message on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('nonexistent@test.com');
    await page.getByLabel(/senha/i).fill('wrongpassword');
    await page.getByRole('button', { name: /entrar/i }).click();

    // Expect an error banner to appear (message from API)
    await expect(page.locator('[style*="color: rgb(198, 40, 40)"], [style*="color:#c62828"]').or(
      page.getByText(/credenciais inválidas/i),
    )).toBeVisible({ timeout: 10_000 });
  });

  test('login with valid credentials navigates to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
    await page.getByLabel(/senha/i).fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).click();

    // Should navigate away from login
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
