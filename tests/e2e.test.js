
import { test, expect } from '@playwright/test';

test.describe('Onboarding E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000');
  });

  test('Complete onboarding flow', async ({ page }) => {
    // Test login
    await page.fill('input[type="email"]', 'qa@test.com');
    await page.fill('input[type="password"]', 'testpass123');
    await page.click('button[type="submit"]');

    // Verify navigation to onboarding
    await expect(page).toHaveURL(/.*onboarding/);

    // Test module access
    await page.click('[data-testid="module-1"]');
    await expect(page.locator('h1')).toContainText('Módulo 1');

    // Test evaluation
    await page.click('[data-testid="start-evaluation"]');
    
    // Answer questions
    for (let i = 1; i <= 20; i++) {
      await page.click(`[data-testid="question-${i}-option-0"]`);
      await page.click('[data-testid="next-question"]');
    }

    // Submit evaluation
    await page.click('[data-testid="submit-evaluation"]');
    
    // Verify results
    await expect(page.locator('[data-testid="evaluation-results"]')).toBeVisible();
  });

  test('Test deadline warning', async ({ page }) => {
    // Login as user with approaching deadline
    await page.fill('input[type="email"]', 'expiring@test.com');
    await page.fill('input[type="password"]', 'testpass123');
    await page.click('button[type="submit"]');

    // Check for deadline warning
    await expect(page.locator('[data-testid="deadline-warning"]')).toBeVisible();
  });

  test('Test admin panel access', async ({ page }) => {
    // Login as admin
    await page.fill('input[type="email"]', 'admin@dwu.com.br');
    await page.fill('input[type="password"]', 'adminpass');
    await page.click('button[type="submit"]');

    // Navigate to admin panel
    await page.goto('/admin');
    
    // Verify admin features
    await expect(page.locator('[data-testid="user-management"]')).toBeVisible();
    await expect(page.locator('[data-testid="evaluation-stats"]')).toBeVisible();
  });
});
