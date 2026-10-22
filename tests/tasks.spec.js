// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Chức năng Quản lý Nhiệm vụ (Task Management)', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Vào trang web, reset dữ liệu cũ
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // 2. Tự động đăng nhập với tài khoản sinh viên chuẩn bị cho các bài kiểm tra
    await page.getByTestId('input-username').fill('student1');
    await page.getByTestId('input-password').fill('123456');
    await page.getByTestId('btn-login').click();

    // 3. Đợi Dashboard hiển thị thành công
    await expect(page.getByTestId('dashboard-view')).toBeVisible();
  });

  // TEST CASE 1 [PASS - Positive]: Xem danh sách công việc ban đầu
  test('[PASS] TC_TASK_01: Hiển thị danh sách nhiệm vụ và các thẻ thống kê ban đầu', async ({ page }) => {
    const taskItems = page.getByTestId('task-item');
    
    // Kiểm tra có các nhiệm vụ mẫu mặc định hiển thị
    await expect(taskItems).toHaveCount(3);

    // Kiểm tra số liệu thống kê
    await expect(page.getByTestId('stat-total')).toHaveText('3');
    await expect(page.getByTestId('stat-pending')).toHaveText('2');
    await expect(page.getByTestId('stat-completed')).toHaveText('1');

    // Kiểm tra thông tin hiển thị của nhiệm vụ đầu tiên
    const firstTask = taskItems.first();
    await expect(firstTask.getByTestId('task-item-title')).toContainText('Nộp báo cáo giữa kỳ môn Kiểm thử phần mềm');
    await expect(firstTask.getByTestId('task-item-subject')).toContainText('Kiểm thử phần mềm');
    await expect(firstTask.getByTestId('task-item-priority')).toContainText('Ưu tiên: Cao');
  });

  // TEST CASE 2 [PASS - Positive]: Thêm mới một nhiệm vụ thành công
  test('[PASS] TC_TASK_02: Thêm mới nhiệm vụ thành công với dữ liệu hợp lệ', async ({ page }) => {
    const taskTitle = 'Làm slide thuyết trình E2E Testing với Playwright';
    const taskSubject = 'Kiểm thử phần mềm';
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const yyyy = futureDate.getFullYear();
    const mm = String(futureDate.getMonth() + 1).padStart(2, '0');
    const dd = String(futureDate.getDate()).padStart(2, '0');
    const taskDueDate = `${yyyy}-${mm}-${dd}`;
    const taskDesc = 'Chuẩn bị kịch bản demo và slide báo cáo cho giảng viên';

    // 1. Điền thông tin vào form
    await page.getByTestId('input-task-title').fill(taskTitle);
    await page.getByTestId('select-task-subject').selectOption(taskSubject);
    await page.getByTestId('select-task-priority').selectOption('high');
    await page.getByTestId('input-task-due-date').fill(taskDueDate);
    await page.getByTestId('input-task-desc').fill(taskDesc);

    // 2. Nhấn nút Lưu nhiệm vụ
    await page.getByTestId('btn-add-task').click();

    // 3. Kiểm tra thông báo Toast hiển thị
    await expect(page.getByTestId('toast')).toContainText('Thêm nhiệm vụ mới thành công!');

    // 4. Kiểm tra nhiệm vụ mới xuất hiện ở đầu danh sách
    const newTask = page.getByTestId('task-item').first();
    await expect(newTask.getByTestId('task-item-title')).toHaveText(taskTitle);
    await expect(newTask.getByTestId('task-item-desc')).toHaveText(taskDesc);
    await expect(newTask.getByTestId('task-item-priority')).toContainText('Ưu tiên: Cao');
    await expect(newTask.getByTestId('task-item-status')).toContainText('Đang chờ');

    // 5. Kiểm tra tổng số lượng tăng lên 4 và số nhiệm vụ đang chờ tăng lên 3
    await expect(page.getByTestId('stat-total')).toHaveText('4');
    await expect(page.getByTestId('stat-pending')).toHaveText('3');
  });

  // TEST CASE 3 [FAIL - Negative]: Thêm nhiệm vụ thất bại khi để trống Tên nhiệm vụ
  test('[FAIL/Validation] TC_TASK_03: Báo lỗi khi thêm nhiệm vụ mà không nhập tiêu đề', async ({ page }) => {
    // 1. Không nhập tiêu đề, chỉ chọn môn học và ghi chú
    await page.getByTestId('input-task-title').fill('');
    await page.getByTestId('select-task-subject').selectOption('Lập trình Web');
    await page.getByTestId('input-task-desc').fill('Ghi chú không có tên nhiệm vụ');

    // 2. Nhấn Lưu nhiệm vụ
    await page.getByTestId('btn-add-task').click();

    // 3. Kiểm tra thông báo lỗi hiển thị trên form
    const formError = page.getByTestId('task-form-error');
    await expect(formError).toBeVisible();
    await expect(formError).toHaveText('Vui lòng nhập tên nhiệm vụ!');

    // 4. Đảm bảo số lượng nhiệm vụ vẫn giữ nguyên là 3 (không bị thêm mới)
    await expect(page.getByTestId('task-item')).toHaveCount(3);
    await expect(page.getByTestId('stat-total')).toHaveText('3');
  });

  // TEST CASE 3B [FAIL - Negative]: Thêm nhiệm vụ thất bại khi chọn Deadline trong quá khứ
  test('[FAIL/Validation] TC_TASK_03B: Báo lỗi khi chọn Deadline trong quá khứ và ngăn chặn lưu task', async ({ page }) => {
    // 1. Kiểm tra thuộc tính min của input date được gán đúng ngày hôm nay
    const todayStr = await page.evaluate(() => {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    });
    const dueDateInput = page.getByTestId('input-task-due-date');
    await expect(dueDateInput).toHaveAttribute('min', todayStr);

    // 2. Điền tiêu đề hợp lệ nhưng nhập ngày trong quá khứ
    await page.getByTestId('input-task-title').fill('Nhiệm vụ có deadline quá khứ');
    await dueDateInput.fill('2020-01-01');

    // 3. Nhấn Lưu nhiệm vụ
    await page.getByTestId('btn-add-task').click();

    // 4. Kiểm tra thông báo lỗi hiển thị rõ ràng trên form
    const formError = page.getByTestId('task-form-error');
    await expect(formError).toBeVisible();
    await expect(formError).toContainText('Hạn nộp không được ở trong quá khứ');

    // 5. Đảm bảo task không được thêm vào danh sách và số lượng nhiệm vụ không đổi
    await expect(page.getByTestId('task-item')).toHaveCount(3);
    await expect(page.getByTestId('stat-total')).toHaveText('3');
  });

  // TEST CASE 3C [PASS - Positive]: Thêm nhiệm vụ thành công với Deadline là ngày hôm nay
  test('[PASS] TC_TASK_03C: Thêm nhiệm vụ thành công khi chọn Deadline là ngày hôm nay', async ({ page }) => {
    const todayStr = await page.evaluate(() => {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    });

    const taskTitle = 'Nhiệm vụ cần nộp gấp trong ngày hôm nay';
    await page.getByTestId('input-task-title').fill(taskTitle);
    await page.getByTestId('input-task-due-date').fill(todayStr);

    // Nhấn Lưu nhiệm vụ
    await page.getByTestId('btn-add-task').click();

    // Kiểm tra thông báo Toast thành công
    await expect(page.getByTestId('toast')).toContainText('Thêm nhiệm vụ mới thành công!');

    // Kiểm tra task xuất hiện ở đầu danh sách với đúng hạn nộp là hôm nay
    const newTask = page.getByTestId('task-item').first();
    await expect(newTask.getByTestId('task-item-title')).toHaveText(taskTitle);
    await expect(newTask.getByTestId('task-item-date')).toContainText(`Hạn: ${todayStr}`);

    // Tổng số lượng tăng lên 4
    await expect(page.getByTestId('stat-total')).toHaveText('4');
  });

  // TEST CASE 4 [PASS - Positive]: Đánh dấu hoàn thành một nhiệm vụ
  test('[PASS] TC_TASK_04: Đánh dấu hoàn thành nhiệm vụ (Mark Complete)', async ({ page }) => {
    // Ban đầu nhiệm vụ 1 đang ở trạng thái Đang chờ
    const firstTask = page.getByTestId('task-item').first();
    await expect(firstTask.getByTestId('task-item-status')).toContainText('Đang chờ');
    await expect(firstTask).not.toHaveClass(/completed/);

    // 1. Nhấn nút toggle hoàn thành
    await firstTask.getByTestId('btn-toggle-task').click();

    // 2. Kiểm tra thông báo Toast
    await expect(page.getByTestId('toast')).toContainText('Đã hoàn thành nhiệm vụ!');

    // 3. Kiểm tra trạng thái đã chuyển sang 'Đã hoàn thành' và class 'completed' được thêm vào
    await expect(firstTask.getByTestId('task-item-status')).toContainText('Đã hoàn thành');
    await expect(firstTask).toHaveClass(/completed/);

    // 4. Kiểm tra thống kê cập nhật: Đã hoàn thành tăng từ 1 lên 2, Đang chờ giảm từ 2 xuống 1
    await expect(page.getByTestId('stat-completed')).toHaveText('2');
    await expect(page.getByTestId('stat-pending')).toHaveText('1');
  });

  // TEST CASE 5 [PASS - Positive]: Chuyển nhiệm vụ đã hoàn thành về lại Đang chờ
  test('[PASS] TC_TASK_05: Chuyển đổi trạng thái từ hoàn thành trở lại Đang chờ', async ({ page }) => {
    // Nhiệm vụ thứ hai trong dữ liệu mẫu (task_2) đã hoàn thành sẵn
    const secondTask = page.getByTestId('task-item').nth(1);
    await expect(secondTask.getByTestId('task-item-status')).toContainText('Đã hoàn thành');

    // 1. Nhấn bỏ chọn hoàn thành
    await secondTask.getByTestId('btn-toggle-task').click();

    // 2. Kiểm tra thông báo Toast
    await expect(page.getByTestId('toast')).toContainText('Đã chuyển nhiệm vụ về Đang chờ!');

    // 3. Kiểm tra trạng thái chuyển về 'Đang chờ'
    await expect(secondTask.getByTestId('task-item-status')).toContainText('Đang chờ');
    await expect(secondTask).not.toHaveClass(/completed/);

    // 4. Số hoàn thành giảm từ 1 xuống 0
    await expect(page.getByTestId('stat-completed')).toHaveText('0');
    await expect(page.getByTestId('stat-pending')).toHaveText('3');
  });

  // TEST CASE 6 [PASS - Positive]: Xóa nhiệm vụ khỏi danh sách
  test('[PASS] TC_TASK_06: Xóa thành công một nhiệm vụ khỏi danh sách', async ({ page }) => {
    const taskItems = page.getByTestId('task-item');
    await expect(taskItems).toHaveCount(3);

    // 1. Lấy tên nhiệm vụ đầu tiên chuẩn bị xóa
    const firstTask = taskItems.first();
    const taskTitleToDelete = await firstTask.getByTestId('task-item-title').innerText();

    // 2. Nhấn nút Xóa (icon thùng rác)
    await firstTask.getByTestId('btn-delete-task').click();

    // 3. Kiểm tra thông báo Toast xóa thành công
    await expect(page.getByTestId('toast')).toContainText(`Đã xóa nhiệm vụ "${taskTitleToDelete}"!`);

    // 4. Kiểm tra số lượng nhiệm vụ giảm từ 3 xuống 2
    await expect(taskItems).toHaveCount(2);
    await expect(page.getByTestId('stat-total')).toHaveText('2');

    // 5. Kiểm tra nhiệm vụ vừa xóa không còn xuất hiện trong danh sách
    await expect(page.locator(`text="${taskTitleToDelete}"`)).toHaveCount(0);
  });

  // TEST CASE 7 [PASS - Positive]: Lọc nhiệm vụ theo trạng thái Hoàn thành / Đang chờ
  test('[PASS] TC_TASK_07: Lọc danh sách nhiệm vụ theo trạng thái', async ({ page }) => {
    // 1. Lọc các nhiệm vụ 'Đã hoàn thành'
    await page.getByTestId('select-filter-status').selectOption('completed');
    
    // Trong dữ liệu mẫu có đúng 1 nhiệm vụ đã hoàn thành
    let visibleTasks = page.getByTestId('task-item');
    await expect(visibleTasks).toHaveCount(1);
    await expect(visibleTasks.first().getByTestId('task-item-status')).toContainText('Đã hoàn thành');

    // 2. Lọc các nhiệm vụ 'Đang chờ'
    await page.getByTestId('select-filter-status').selectOption('pending');
    visibleTasks = page.getByTestId('task-item');
    await expect(visibleTasks).toHaveCount(2);

    // 3. Đưa về lọc 'Tất cả'
    await page.getByTestId('select-filter-status').selectOption('all');
    visibleTasks = page.getByTestId('task-item');
    await expect(visibleTasks).toHaveCount(3);
  });

  // TEST CASE 8 [PASS - Positive]: Tìm kiếm nhiệm vụ và kiểm tra trạng thái Trống (Empty State)
  test('[PASS] TC_TASK_08: Tìm kiếm theo từ khóa và hiển thị Empty State khi không có kết quả', async ({ page }) => {
    const searchInput = page.getByTestId('input-search');

    // 1. Tìm từ khóa 'Lập trình'
    await searchInput.fill('Lập trình');
    let visibleTasks = page.getByTestId('task-item');
    await expect(visibleTasks).toHaveCount(1);
    await expect(visibleTasks.first().getByTestId('task-item-title')).toContainText('Làm bài thực hành Lập trình Web');

    // 2. Tìm một từ khóa không tồn tại
    await searchInput.fill('Từ khóa chắc chắn không có 123456');
    await expect(page.getByTestId('task-item')).toHaveCount(0);

    // 3. Kiểm tra Empty State xuất hiện
    await expect(page.getByTestId('empty-state')).toBeVisible();
    await expect(page.getByTestId('empty-state')).toContainText('Không tìm thấy nhiệm vụ nào');

    // 4. Xóa ô tìm kiếm -> Danh sách hiển thị lại đầy đủ
    await searchInput.fill('');
    await expect(page.getByTestId('empty-state')).toBeHidden();
    await expect(page.getByTestId('task-item')).toHaveCount(3);
  });

});
