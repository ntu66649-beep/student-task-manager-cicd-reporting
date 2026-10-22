// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Chức năng Quản trị viên (Admin Dashboard & Role Separation)', () => {

  test.beforeEach(async ({ page }) => {
    // Truy cập trang và xóa session cũ để đảm bảo tính độc lập
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // TEST CASE 1 [PASS - Positive]: Đăng nhập tài khoản Admin mở đúng Admin Dashboard
  test('[PASS] TC_ADMIN_01: Đăng nhập tài khoản Admin thành công và chuyển hướng đến Admin Dashboard', async ({ page }) => {
    // 1. Nhập thông tin tài khoản Admin
    await page.getByTestId('input-username').fill('admin');
    await page.getByTestId('input-password').fill('admin123');
    await page.getByTestId('btn-login').click();

    // 2. Kiểm tra Admin Dashboard hiển thị và Student Dashboard bị ẩn
    await expect(page.getByTestId('admin-dashboard-view')).toBeVisible();
    await expect(page.getByTestId('dashboard-view')).toBeHidden();
    await expect(page.getByTestId('auth-view')).toBeHidden();

    // 3. Kiểm tra lời chào Admin và Toast chào mừng
    await expect(page.getByTestId('admin-greeting')).toContainText('Giảng viên Hướng Dẫn');
    await expect(page.getByTestId('toast')).toContainText('Chào mừng Quản trị viên');
  });

  // TEST CASE 2 [PASS - Positive]: Thống kê tổng quan toàn hệ thống hiển thị chính xác
  test('[PASS] TC_ADMIN_02: Thống kê số lượng sinh viên và bài tập toàn hệ thống chính xác', async ({ page }) => {
    // Đăng nhập Admin
    await page.getByTestId('input-username').fill('admin');
    await page.getByTestId('input-password').fill('admin123');
    await page.getByTestId('btn-login').click();
    await expect(page.getByTestId('admin-dashboard-view')).toBeVisible();

    // Kiểm tra tổng số sinh viên (student1 và student2)
    await expect(page.getByTestId('admin-stat-students')).toHaveText('2');

    // Kiểm tra tổng số nhiệm vụ hệ thống (student1: 3, student2: 2 => tổng 5)
    await expect(page.getByTestId('admin-stat-total-tasks')).toHaveText('5');

    // Kiểm tra số nhiệm vụ đã hoàn thành (student1: 1, student2: 1 => tổng 2)
    await expect(page.getByTestId('admin-stat-completed-tasks')).toHaveText('2');

    // Kiểm tra số nhiệm vụ đang chờ (5 - 2 = 3)
    await expect(page.getByTestId('admin-stat-pending-tasks')).toHaveText('3');
  });

  // TEST CASE 3 [PASS - Positive]: Danh sách sinh viên hiển thị đầy đủ thông tin
  test('[PASS] TC_ADMIN_03: Hiển thị danh sách sinh viên kèm tiến độ hoàn thành', async ({ page }) => {
    await page.getByTestId('input-username').fill('admin');
    await page.getByTestId('input-password').fill('admin123');
    await page.getByTestId('btn-login').click();

    const studentItems = page.getByTestId('admin-student-item');
    await expect(studentItems).toHaveCount(2);

    // Kiểm tra thông tin sinh viên 1
    const student1Card = studentItems.filter({ hasText: 'student1' });
    await expect(student1Card).toContainText('Nguyễn Văn Tuấn');
    await expect(student1Card).toContainText('@student1');

    // Kiểm tra thông tin sinh viên 2
    const student2Card = studentItems.filter({ hasText: 'student2' });
    await expect(student2Card).toContainText('Trần Thị Mai');
    await expect(student2Card).toContainText('@student2');
  });

  // TEST CASE 4 [PASS - Positive]: Chọn sinh viên để xem chi tiết các nhiệm vụ
  test('[PASS] TC_ADMIN_04: Chọn từng sinh viên để xem chi tiết danh sách nhiệm vụ của sinh viên đó', async ({ page }) => {
    await page.getByTestId('input-username').fill('admin');
    await page.getByTestId('input-password').fill('admin123');
    await page.getByTestId('btn-login').click();

    // Mặc định sinh viên 1 được chọn
    await expect(page.getByTestId('admin-selected-student-name')).toHaveText('Nguyễn Văn Tuấn');
    let taskItems = page.getByTestId('admin-task-item');
    await expect(taskItems).toHaveCount(3);

    // Click chọn sinh viên 2 (Trần Thị Mai)
    const student2Card = page.getByTestId('admin-student-item').filter({ hasText: 'student2' });
    await student2Card.click();

    // Kiểm tra tên sinh viên được chọn đổi thành Trần Thị Mai
    await expect(page.getByTestId('admin-selected-student-name')).toHaveText('Trần Thị Mai');

    // Kiểm tra hiển thị đúng 2 bài tập của sinh viên 2
    taskItems = page.getByTestId('admin-task-item');
    await expect(taskItems).toHaveCount(2);
    await expect(taskItems.first().getByTestId('admin-task-title')).toContainText('Thiết kế ERD');
    await expect(taskItems.nth(1).getByTestId('admin-task-title')).toContainText('Lập trình API RESTful');
  });

  // TEST CASE 5 [PASS - Positive]: Lọc nhiệm vụ của sinh viên theo trạng thái
  test('[PASS] TC_ADMIN_05: Lọc danh sách bài tập của sinh viên theo trạng thái', async ({ page }) => {
    await page.getByTestId('input-username').fill('admin');
    await page.getByTestId('input-password').fill('admin123');
    await page.getByTestId('btn-login').click();

    // Chuyển sang sinh viên 2 (có 1 task hoàn thành, 1 task đang chờ)
    const student2Card = page.getByTestId('admin-student-item').filter({ hasText: 'student2' });
    await student2Card.click();

    // 1. Lọc 'Đã hoàn thành'
    await page.getByTestId('admin-filter-status').selectOption('completed');
    let visibleTasks = page.getByTestId('admin-task-item');
    await expect(visibleTasks).toHaveCount(1);
    await expect(visibleTasks.first().getByTestId('admin-task-status')).toContainText('Đã hoàn thành');

    // 2. Lọc 'Đang chờ'
    await page.getByTestId('admin-filter-status').selectOption('pending');
    visibleTasks = page.getByTestId('admin-task-item');
    await expect(visibleTasks).toHaveCount(1);
    await expect(visibleTasks.first().getByTestId('admin-task-status')).toContainText('Đang chờ');

    // 3. Trả về 'Tất cả'
    await page.getByTestId('admin-filter-status').selectOption('all');
    visibleTasks = page.getByTestId('admin-task-item');
    await expect(visibleTasks).toHaveCount(2);
  });

  // TEST CASE 6 [PASS - Positive]: Phân quyền - Tài khoản Student không mở Admin Dashboard
  test('[PASS] TC_ADMIN_06: Tài khoản Student đăng nhập chỉ vào giao diện Student, không hiển thị Admin Dashboard', async ({ page }) => {
    await page.getByTestId('input-username').fill('student1');
    await page.getByTestId('input-password').fill('123456');
    await page.getByTestId('btn-login').click();

    // Kiểm tra Student Dashboard mở và Admin Dashboard ẩn
    await expect(page.getByTestId('dashboard-view')).toBeVisible();
    await expect(page.getByTestId('admin-dashboard-view')).toBeHidden();
    await expect(page.getByTestId('user-greeting')).toContainText('Nguyễn Văn Tuấn');
  });

  // TEST CASE 7 [PASS - Positive]: Đăng xuất khỏi Admin Dashboard thành công
  test('[PASS] TC_ADMIN_07: Đăng xuất khỏi Admin Dashboard quay về màn hình Đăng nhập', async ({ page }) => {
    await page.getByTestId('input-username').fill('admin');
    await page.getByTestId('input-password').fill('admin123');
    await page.getByTestId('btn-login').click();
    await expect(page.getByTestId('admin-dashboard-view')).toBeVisible();

    // Nhấn nút Đăng xuất của Admin
    await page.getByTestId('btn-admin-logout').click();

    // Kiểm tra quay lại Auth View
    await expect(page.getByTestId('auth-view')).toBeVisible();
    await expect(page.getByTestId('admin-dashboard-view')).toBeHidden();
    await expect(page.getByTestId('toast')).toContainText('Đã đăng xuất thành công!');
  });

});
