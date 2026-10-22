// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Chức năng Xác thực (Authentication: Login & Logout)', () => {

  test.beforeEach(async ({ page }) => {
    // Truy cập trang web và xóa dữ liệu session cũ để đảm bảo tính độc lập giữa các test case
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // TEST CASE 1 [PASS - Positive]: Đăng nhập thành công với thông tin hợp lệ
  test('[PASS] TC_AUTH_01: Đăng nhập thành công với tài khoản và mật khẩu đúng', async ({ page }) => {
    // 1. Kiểm tra màn hình đăng nhập hiển thị
    await expect(page.getByTestId('auth-view')).toBeVisible();
    await expect(page.getByTestId('dashboard-view')).toBeHidden();

    // 2. Điền thông tin tài khoản hợp lệ
    await page.getByTestId('input-username').fill('student1');
    await page.getByTestId('input-password').fill('123456');

    // 3. Nhấn nút Đăng nhập
    await page.getByTestId('btn-login').click();

    // 4. Kiểm tra kết quả: chuyển sang màn hình Dashboard, hiển thị tên người dùng
    await expect(page.getByTestId('dashboard-view')).toBeVisible();
    await expect(page.getByTestId('auth-view')).toBeHidden();
    await expect(page.getByTestId('user-greeting')).toContainText('Nguyễn Văn Tuấn');
    await expect(page.getByTestId('toast')).toContainText('Chào mừng Nguyễn Văn Tuấn');
  });

  // TEST CASE 2 [FAIL - Negative]: Đăng nhập thất bại khi để trống ô Tên đăng nhập và Mật khẩu
  test('[FAIL/Validation] TC_AUTH_02: Báo lỗi khi để trống trường đăng nhập', async ({ page }) => {
    // 1. Để trống username & password, bấm nút Đăng nhập
    await page.getByTestId('btn-login').click();

    // 2. Kiểm tra thông báo lỗi hiển thị
    const authError = page.getByTestId('auth-error');
    await expect(authError).toBeVisible();
    await expect(authError).toHaveText('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');

    // 3. Đảm bảo vẫn ở lại màn hình đăng nhập, không vào được dashboard
    await expect(page.getByTestId('dashboard-view')).toBeHidden();
    await expect(page.getByTestId('auth-view')).toBeVisible();
  });

  // TEST CASE 3 [FAIL - Negative]: Đăng nhập thất bại khi nhập sai mật khẩu
  test('[FAIL/Validation] TC_AUTH_03: Báo lỗi khi nhập sai mật khẩu', async ({ page }) => {
    // 1. Nhập username đúng nhưng mật khẩu sai
    await page.getByTestId('input-username').fill('student1');
    await page.getByTestId('input-password').fill('sai_mat_khau_123');
    await page.getByTestId('btn-login').click();

    // 2. Kiểm tra thông báo lỗi hiển thị
    const authError = page.getByTestId('auth-error');
    await expect(authError).toBeVisible();
    await expect(authError).toHaveText('Tên đăng nhập hoặc mật khẩu không chính xác!');

    // 3. Không cho phép vào màn hình quản lý
    await expect(page.getByTestId('dashboard-view')).toBeHidden();
  });

  // TEST CASE 4 [FAIL - Negative]: Đăng nhập thất bại với tài khoản không tồn tại
  test('[FAIL/Validation] TC_AUTH_04: Báo lỗi khi tài khoản không tồn tại trong hệ thống', async ({ page }) => {
    await page.getByTestId('input-username').fill('user_khong_ton_tai');
    await page.getByTestId('input-password').fill('123456');
    await page.getByTestId('btn-login').click();

    const authError = page.getByTestId('auth-error');
    await expect(authError).toBeVisible();
    await expect(authError).toHaveText('Tên đăng nhập hoặc mật khẩu không chính xác!');
    await expect(page.getByTestId('dashboard-view')).toBeHidden();
  });

  // TEST CASE 5 [PASS - Positive]: Đăng xuất thành công khỏi hệ thống
  test('[PASS] TC_AUTH_05: Đăng xuất tài khoản và quay về màn hình Đăng nhập', async ({ page }) => {
    // 1. Đăng nhập trước
    await page.getByTestId('input-username').fill('student1');
    await page.getByTestId('input-password').fill('123456');
    await page.getByTestId('btn-login').click();
    await expect(page.getByTestId('dashboard-view')).toBeVisible();

    // 2. Nhấn nút Đăng xuất
    await page.getByTestId('btn-logout').click();

    // 3. Kiểm tra đã quay về màn hình Đăng nhập và ẩn Dashboard
    await expect(page.getByTestId('auth-view')).toBeVisible();
    await expect(page.getByTestId('dashboard-view')).toBeHidden();
    await expect(page.getByTestId('toast')).toContainText('Đã đăng xuất thành công!');
  });

});
