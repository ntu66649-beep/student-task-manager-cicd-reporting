// @ts-check
const { test, expect } = require('@playwright/test');

async function login(page, username = 'student1') {
  await page.getByTestId('input-username').fill(username);
  await page.getByTestId('input-password').fill(username === 'admin' ? 'admin123' : '123456');
  await page.getByTestId('btn-login').click();
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-27T10:00:00+07:00'));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('Edit an overdue task without duplicating it; retain changes after reload', async ({ page }) => {
  await login(page);
  const original = await page.evaluate(() => JSON.parse(localStorage.getItem('student_tasks_student1') || '[]')[0]);
  await page.getByTestId('task-item').first().getByTestId('btn-edit-task').click();
  await page.getByTestId('input-task-title').fill('Báo cáo đã cập nhật');
  await page.getByTestId('input-task-desc').fill('Ghi chú mới');
  await page.getByTestId('select-task-priority').selectOption('low');
  await page.getByTestId('btn-add-task').click();
  await expect(page.getByTestId('toast')).toContainText('Cập nhật nhiệm vụ thành công');
  await expect(page.getByTestId('task-item')).toHaveCount(3);
  await page.reload();
  const updated = page.getByTestId('task-item').first();
  await expect(updated.getByTestId('task-item-title')).toHaveText('Báo cáo đã cập nhật');
  await expect(updated.getByTestId('task-item-desc')).toHaveText('Ghi chú mới');
  await expect(updated.getByTestId('task-item-priority')).toContainText('Thấp');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('student_tasks_student1') || '[]')[0]);
  expect(stored.id).toBe(original.id);
  expect(stored.createdAt).toBe(original.createdAt);
  expect(stored.dueDate).toBe(original.dueDate);
});

test('Editing retains completion and rejects a different deadline in the past', async ({ page }) => {
  await login(page);
  await page.getByTestId('task-item').nth(1).getByTestId('btn-edit-task').click();
  await page.getByTestId('input-task-due-date').fill('2020-01-01');
  await page.getByTestId('btn-add-task').click();
  await expect(page.getByTestId('task-form-error')).toContainText('Hạn nộp không được ở trong quá khứ');
  await page.getByTestId('input-task-due-date').fill('2026-11-01');
  await page.getByTestId('input-task-title').fill('Bài thực hành đã chỉnh sửa');
  await page.getByTestId('btn-add-task').click();
  await expect(page.getByTestId('task-item').nth(1).getByTestId('task-item-status')).toContainText('Đã hoàn thành');
  await expect(page.getByTestId('stat-completed')).toHaveText('1');
});

test('Cancel and delete during editing return the form to creating a task', async ({ page }) => {
  await login(page);
  await page.getByTestId('task-item').first().getByTestId('btn-edit-task').click();
  await page.getByTestId('input-task-title').fill('Không lưu thay đổi này');
  await page.getByTestId('btn-cancel-edit').click();
  await expect(page.getByTestId('input-task-title')).toHaveValue('');
  await expect(page.getByTestId('task-item').first().getByTestId('task-item-title')).not.toHaveText('Không lưu thay đổi này');
  await page.getByTestId('task-item').first().getByTestId('btn-edit-task').click();
  await page.getByTestId('task-item').first().getByTestId('btn-delete-task').click();
  await expect(page.getByTestId('btn-cancel-edit')).toBeHidden();
  await page.getByTestId('input-task-title').fill('Nhiệm vụ sau khi xóa');
  await page.getByTestId('btn-add-task').click();
  await expect(page.getByTestId('task-item')).toHaveCount(3);
  await expect(page.getByTestId('task-item').first().getByTestId('task-item-title')).toHaveText('Nhiệm vụ sau khi xóa');
});

test('Overdue filter excludes completed tasks and updates progress when completing', async ({ page }) => {
  await login(page);
  await expect(page.getByTestId('stat-overdue')).toHaveText('1');
  await expect(page.locator('#task-progress')).toHaveAttribute('value', '33');
  await page.getByTestId('select-filter-status').selectOption('overdue');
  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await expect(page.getByTestId('task-overdue')).toHaveText('Quá hạn');
  await page.getByTestId('btn-toggle-task').click();
  await expect(page.getByTestId('task-item')).toHaveCount(0);
  await expect(page.getByTestId('empty-state')).toBeVisible();
  await expect(page.getByTestId('stat-overdue')).toHaveText('0');
  await expect(page.locator('#task-progress')).toHaveAttribute('value', '67');
  await page.getByTestId('btn-reset-filters').click();
  await expect(page.getByTestId('task-item')).toHaveCount(3);
});

test('Sort by deadline or priority without changing stored task order', async ({ page }) => {
  await login(page);
  await page.getByTestId('input-task-title').fill('Không có hạn nộp');
  await page.getByTestId('btn-add-task').click();
  await page.getByTestId('select-sort-tasks').selectOption('due-date');
  await expect(page.getByTestId('task-item').first().getByTestId('task-item-title')).toContainText('Làm bài thực hành');
  await expect(page.getByTestId('task-item').last().getByTestId('task-item-title')).toHaveText('Không có hạn nộp');
  await page.getByTestId('select-sort-tasks').selectOption('priority');
  await expect(page.getByTestId('task-item').first().getByTestId('task-item-priority')).toContainText('Cao');
  await expect(page.getByTestId('task-item').last().getByTestId('task-item-priority')).toContainText('Thấp');
  await page.getByTestId('input-search').fill('không tìm thấy');
  await page.getByTestId('select-filter-priority').selectOption('high');
  await page.getByTestId('btn-reset-filters').click();
  await expect(page.getByTestId('task-item')).toHaveCount(4);
  await expect(page.getByTestId('task-item').first().getByTestId('task-item-title')).toHaveText('Không có hạn nộp');
  await page.reload();
  await expect(page.getByTestId('task-item').first().getByTestId('task-item-title')).toHaveText('Không có hạn nộp');
});

test('Student2 receives their own sample tasks on first login and admin sees matching totals', async ({ page }) => {
  await login(page, 'student2');
  await expect(page.getByTestId('task-item')).toHaveCount(2);
  await expect(page.getByTestId('task-item').first().getByTestId('task-item-title')).toContainText('Thiết kế ERD');
  await page.getByTestId('btn-logout').click();
  await login(page, 'admin');
  await expect(page.getByTestId('admin-stat-total-tasks')).toHaveText('5');
});

test('Changing accounts clears filters and unfinished edits', async ({ page }) => {
  await login(page);
  await page.getByTestId('task-item').first().getByTestId('btn-edit-task').click();
  await page.getByTestId('input-task-desc').fill('Bản nháp riêng tư');
  await page.getByTestId('input-search').fill('không có kết quả');
  await page.getByTestId('select-filter-status').selectOption('completed');
  await page.getByTestId('btn-logout').click();
  await login(page, 'student2');
  await expect(page.getByTestId('input-task-title')).toHaveValue('');
  await expect(page.getByTestId('input-task-desc')).toHaveValue('');
  await expect(page.getByTestId('input-search')).toHaveValue('');
  await expect(page.getByTestId('select-filter-status')).toHaveValue('all');
  await expect(page.getByTestId('task-item')).toHaveCount(2);
});

for (const width of [320, 375, 768, 1280]) {
  test(`Student and admin layouts fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const noOverflow = async () => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    };
    await noOverflow();
    await login(page);
    await page.getByTestId('input-task-title').fill('Nhiệm vụ ' + 'W'.repeat(150));
    await page.getByTestId('btn-add-task').click();
    await noOverflow();
    await page.getByTestId('task-item').first().getByTestId('btn-edit-task').click();
    await expect(page.getByTestId('input-task-title')).toBeFocused();
    await page.getByTestId('btn-logout').click();
    await login(page, 'admin');
    await expect(page.getByTestId('admin-dashboard-view')).toBeVisible();
    await noOverflow();
  });
}
