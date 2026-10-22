// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Kiểm thử Độ bền dữ liệu (Data Persistence & Session)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // TEST CASE: Giữ phiên đăng nhập và dữ liệu sau khi F5 tải lại trang
  test('[PASS] TC_PERSIST_01: Duy trì phiên đăng nhập và dữ liệu nhiệm vụ sau khi F5 trang', async ({ page }) => {
    // 1. Đăng nhập
    await page.getByTestId('input-username').fill('student1');
    await page.getByTestId('input-password').fill('123456');
    await page.getByTestId('btn-login').click();
    await expect(page.getByTestId('dashboard-view')).toBeVisible();

    // 2. Thêm một task mới
    const testTitle = 'Nhiệm vụ kiểm tra F5 reload';
    await page.getByTestId('input-task-title').fill(testTitle);
    await page.getByTestId('btn-add-task').click();
    await expect(page.getByTestId('task-item')).toHaveCount(4);

    // 3. F5 Reload trang web
    await page.reload();

    // 4. Kiểm tra người dùng vẫn đang ở Dashboard (không bị đẩy về màn hình đăng nhập)
    await expect(page.getByTestId('dashboard-view')).toBeVisible();
    await expect(page.getByTestId('user-greeting')).toContainText('Nguyễn Văn Tuấn');

    // 5. Kiểm tra nhiệm vụ mới thêm vẫn còn nguyên vẹn sau khi reload
    await expect(page.getByTestId('task-item')).toHaveCount(4);
    await expect(page.locator(`text="${testTitle}"`)).toBeVisible();
  });

});
