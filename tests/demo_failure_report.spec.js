// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * FILE TEST DEMO: Dùng để biểu diễn cho Giảng viên xem cách Playwright 
 * phát hiện lỗi (Assertion Failure), so sánh Expected vs Actual, tự động chụp ảnh
 * màn hình lỗi (Screenshot), ghi lại trace và tạo báo cáo HTML.
 * 
 * Mặc định bài test này luôn bị SKIP khi chạy npm test thông thường để bảo toàn kết quả kiểm thử chính.
 * Chỉ kích hoạt khi chạy lệnh riêng: npm run demo:failure (RUN_DEMO_FAIL=true).
 */
test.describe('Demo Báo cáo Lỗi Thực tế (Controlled Assertion Failure Demo)', () => {

  test('TC_DEMO_FAIL: Cố ý so khớp sai để chứng minh khả năng phát hiện lỗi của Playwright', async ({ page }) => {
    // Mặc định luôn bị SKIP khi chạy npm test để bảo toàn kết quả kiểm thử chính (23 passed, 1 skipped)
    test.skip(process.env.RUN_DEMO_FAIL !== 'true', 'Bỏ qua mặc định. Kích hoạt qua lệnh: npm run demo:failure');

    await page.goto('/');

    // 1. Nhập thông tin đăng nhập với mật khẩu sai
    await page.getByTestId('input-username').fill('student1');
    await page.getByTestId('input-password').fill('sai_mat_khau_demo');
    await page.getByTestId('btn-login').click();

    // 2. Hệ thống thực tế hiển thị thông báo lỗi màu đỏ trên màn hình Login
    await expect(page.getByTestId('auth-error')).toBeVisible();

    // 3. ASSERTION SAI CÓ KIỂM SOÁT (Controlled Failure):
    // Cố ý giả lập kịch bản test mong đợi Dashboard hiển thị (toBeVisible) dù đã nhập sai mật khẩu.
    // Vì mật khẩu sai nên trang web không vào Dashboard -> Assertion này chắc chắn THẤT BẠI.
    // Playwright sẽ chỉ ra Expected: visible nhưng Received: hidden,
    // đồng thời tự động chụp ảnh màn hình lỗi (Screenshot) và ghi trace vào HTML Report.
    await expect(page.getByTestId('dashboard-view')).toBeVisible({ timeout: 3500 });
  });

});
