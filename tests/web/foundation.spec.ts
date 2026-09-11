import { expect, test } from '@playwright/test';
test('connects the React Native Web shell to the actual API', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Clinic EHR' })).toBeVisible();
  await expect(page.getByText('Connected', { exact: true })).toBeVisible();
});
test('shows connection failure and allows retry', async ({ page }) => {
  await page.route('**/graphql', route => route.abort());
  await page.goto('/');
  await expect(page.getByText('Connection unavailable', { exact: true })).toBeVisible();
  await page.unroute('**/graphql');
  await page.getByRole('button', { name: 'Check connection' }).click();
  await expect(page.getByText('Connected', { exact: true })).toBeVisible();
});
