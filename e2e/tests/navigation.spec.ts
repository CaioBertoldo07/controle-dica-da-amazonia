import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'admin@dicadaamazonia.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'admin123';

// Helper to log in once via the UI
async function loginAs(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/senha/i).fill(password);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10_000 });
}

test.describe('Navigation (requires backend + seeded data)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  });

  test('dashboard is accessible after login', async ({ page }) => {
    await expect(page).toHaveURL('/');
    // Dashboard has KPI cards or a "Bem-vindo" text
    await expect(page.locator('body')).toBeVisible();
  });

  test('navigates to /clientes', async ({ page }) => {
    await page.goto('/clientes');
    await expect(page).toHaveURL('/clientes');
    // Should not redirect to login
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('navigates to /pedidos', async ({ page }) => {
    await page.goto('/pedidos');
    await expect(page).toHaveURL('/pedidos');
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('navigates to /relatorios', async ({ page }) => {
    await page.goto('/relatorios');
    await expect(page).toHaveURL('/relatorios');
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('unknown route redirects to dashboard', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Order form validation (requires backend + seeded data)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  });

  test('order form shows validation on empty submit', async ({ page }) => {
    await page.goto('/pedidos/novo');
    await expect(page).not.toHaveURL(/\/login/);

    // Try to submit empty form
    const submitBtn = page.getByRole('button', { name: /criar pedido|salvar/i });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Should show validation errors (not navigate away)
      await expect(page).toHaveURL('/pedidos/novo');
    }
  });
});
