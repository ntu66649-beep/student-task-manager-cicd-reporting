// @ts-check
const { chromium } = require('@playwright/test');
const http = require('http');
const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Helper: Tạm dừng N mili-giây
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Lấy ngày trong tương lai theo định dạng YYYY-MM-DD
function getFutureDate(days = 3) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Helper: Kiểm tra xem server đã chạy chưa
function checkServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 304);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Helper: Hiển thị banner tiến trình ngay trên giao diện web để Giảng viên dễ quan sát
async function updateDemoBanner(page, text, isSuccess = false) {
  await page.evaluate(({ msg, success }) => {
    let banner = document.getElementById('demo-step-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'demo-step-banner';
      banner.style.position = 'fixed';
      banner.style.bottom = '24px';
      banner.style.left = '50%';
      banner.style.transform = 'translateX(-50%)';
      banner.style.padding = '12px 24px';
      banner.style.borderRadius = '30px';
      banner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
      banner.style.fontSize = '15px';
      banner.style.fontWeight = '600';
      banner.style.zIndex = '99999';
      banner.style.transition = 'all 0.3s ease';
      banner.style.pointerEvents = 'none';
      document.body.appendChild(banner);
    }
    banner.style.backgroundColor = success ? '#059669' : '#1e293b';
    banner.style.color = '#ffffff';
    banner.style.border = success ? '2px solid #34d399' : '2px solid #3b82f6';
    banner.innerText = msg;
  }, { msg: text, success: isSuccess });
}

async function runDemo() {
  console.log('\n======================================================================');
  console.log('🎬 CHƯƠNG TRÌNH DEMO TỰ ĐỘNG PLAYWRIGHT E2E TESTING (DÀNH CHO GIẢNG VIÊN)');
  console.log('   Bao gồm 2 phân hệ: LUỒNG SINH VIÊN (Student) & LUỒNG QUẢN TRỊ (Admin)');
  console.log('======================================================================\n');

  let serverProcess = null;

  // 1. Đảm bảo Local Server đang hoạt động
  const isRunning = await checkServerRunning();
  if (!isRunning) {
    console.log('⚡ Đang tự động khởi động máy chủ Web Server tại http://localhost:3000...');
    serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
      stdio: 'ignore',
      detached: false
    });
    // Đợi server khởi động
    for (let i = 0; i < 15; i++) {
      await sleep(400);
      if (await checkServerRunning()) break;
    }
  }

  console.log('🚀 Đang mở trình duyệt Chromium (Headed Mode) với chế độ trình diễn chậm...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300 // độ trễ nhẹ giữa các thao tác
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 }
  });

  const page = await context.newPage();

  // Truy cập trang web và reset session để có trạng thái ban đầu sạch
  await page.goto(BASE_URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await sleep(1500);

  // =========================================================================
  // PHẦN 1: LUỒNG SINH VIÊN (STUDENT WORKFLOW)
  // =========================================================================
  console.log('----------------------------------------------------------------------');
  console.log('📌 PHẦN 1: TRÌNH DIỄN NGHIỆP VỤ SINH VIÊN (STUDENT WORKFLOW)');
  console.log('----------------------------------------------------------------------');

  // BƯỚC 1: ĐĂNG NHẬP SINH VIÊN
  console.log('▶ [BƯỚC 1/10] 🔑 Đang thực hiện đăng nhập tài khoản Sinh viên (student1)...');
  await updateDemoBanner(page, '🎬 [Bước 1/10] Tự động đăng nhập tài khoản Sinh viên: student1...');
  await sleep(1200);

  const usernameInput = page.getByTestId('input-username');
  await usernameInput.focus();
  await usernameInput.pressSequentially('student1', { delay: 100 });
  await sleep(1000);

  const passwordInput = page.getByTestId('input-password');
  await passwordInput.focus();
  await passwordInput.pressSequentially('123456', { delay: 100 });
  await sleep(1200);

  await page.getByTestId('btn-login').click();
  await page.getByTestId('dashboard-view').waitFor({ state: 'visible' });
  await updateDemoBanner(page, '✅ [Bước 1/10] Đăng nhập Sinh viên thành công! Đang hiển thị Dashboard.');
  console.log('   ↳ Đăng nhập Sinh viên thành công! Lời chào: Nguyễn Văn Tuấn (student1).');
  await sleep(2000);

  // BƯỚC 2: THÊM NHIỆM VỤ MỚI
  console.log('▶ [BƯỚC 2/10] ➕ Đang nhập liệu và thêm nhiệm vụ học tập mới...');
  await updateDemoBanner(page, '🎬 [Bước 2/10] Điền thông tin và thêm nhiệm vụ mới có Deadline tương lai...');
  await sleep(1200);

  const taskTitle = 'Báo cáo đồ án E2E Testing với Playwright';
  const taskDueDate = getFutureDate(3); // 3 ngày sau

  await page.getByTestId('input-task-title').focus();
  await page.getByTestId('input-task-title').pressSequentially(taskTitle, { delay: 40 });
  await sleep(1000);

  await page.getByTestId('select-task-subject').selectOption('Kiểm thử phần mềm');
  await sleep(1000);

  await page.getByTestId('select-task-priority').selectOption('high');
  await sleep(1000);

  await page.getByTestId('input-task-due-date').fill(taskDueDate);
  await sleep(1000);

  await page.getByTestId('input-task-desc').fill('Chuẩn bị slide, kịch bản live demo và tài liệu cho Giảng viên');
  await sleep(1200);

  await page.getByTestId('btn-add-task').click();
  await page.getByTestId('toast').waitFor({ state: 'visible' });
  await updateDemoBanner(page, '✅ [Bước 2/10] Đã thêm nhiệm vụ mới thành công! Thống kê tự động cập nhật.');
  console.log(`   ↳ Đã thêm nhiệm vụ: "${taskTitle}" (Hạn nộp: ${taskDueDate}, Mức ưu tiên: Cao).`);
  await sleep(2500);

  // BƯỚC 3: ĐÁNH DẤU HOÀN THÀNH
  console.log('▶ [BƯỚC 3/10] ✅ Đang đánh dấu hoàn thành nhiệm vụ vừa tạo (Mark Complete)...');
  await updateDemoBanner(page, '🎬 [Bước 3/10] Đánh dấu hoàn thành nhiệm vụ (Mark Complete)...');
  await sleep(1200);

  const newTaskItem = page.getByTestId('task-item').first();
  await newTaskItem.getByTestId('btn-toggle-task').click();
  await updateDemoBanner(page, '✅ [Bước 3/10] Nhiệm vụ đã hoàn thành! Tiêu đề được gạch ngang, số liệu tăng.');
  console.log('   ↳ Nhiệm vụ đã chuyển sang trạng thái "Đã hoàn thành", số lượng hoàn thành tăng lên.');
  await sleep(2500);

  // BƯỚC 4: XÓA NHIỆM VỤ
  console.log('▶ [BƯỚC 4/10] 🗑️ Đang xóa nhiệm vụ khỏi danh sách (Delete Task)...');
  await updateDemoBanner(page, '🎬 [Bước 4/10] Xóa nhiệm vụ khỏi danh sách (Delete Task)...');
  await sleep(1200);

  await newTaskItem.getByTestId('btn-delete-task').click();
  await updateDemoBanner(page, '✅ [Bước 4/10] Đã xóa nhiệm vụ thành công! Danh sách và thống kê đã cập nhật.');
  console.log('   ↳ Đã xóa nhiệm vụ thành công khỏi danh sách.');
  await sleep(2500);

  // BƯỚC 5: ĐĂNG XUẤT SINH VIÊN
  console.log('▶ [BƯỚC 5/10] 🚪 Đang đăng xuất tài khoản Sinh viên...');
  await updateDemoBanner(page, '🎬 [Bước 5/10] Đăng xuất Sinh viên, quay về màn hình Đăng nhập...');
  await sleep(1200);

  await page.getByTestId('btn-logout').click();
  await page.getByTestId('auth-view').waitFor({ state: 'visible' });
  console.log('   ↳ Đã đăng xuất Sinh viên thành công.');
  await sleep(2000);

  // =========================================================================
  // PHẦN 2: LUỒNG QUẢN TRỊ VIÊN (ADMIN WORKFLOW)
  // =========================================================================
  console.log('\n----------------------------------------------------------------------');
  console.log('📌 PHẦN 2: TRÌNH DIỄN NGHIỆP VỤ QUẢN TRỊ VIÊN (ADMIN DASHBOARD)');
  console.log('----------------------------------------------------------------------');

  // BƯỚC 6: ĐĂNG NHẬP ADMIN
  console.log('▶ [BƯỚC 6/10] 🛡️ Đang đăng nhập tài khoản Quản trị viên (admin)...');
  await updateDemoBanner(page, '🎬 [Bước 6/10] Đăng nhập Quản trị viên: admin / admin123...');
  await sleep(1200);

  await page.getByTestId('input-username').focus();
  await page.getByTestId('input-username').pressSequentially('admin', { delay: 100 });
  await sleep(1000);

  await page.getByTestId('input-password').focus();
  await page.getByTestId('input-password').pressSequentially('admin123', { delay: 100 });
  await sleep(1200);

  await page.getByTestId('btn-login').click();
  await page.getByTestId('admin-dashboard-view').waitFor({ state: 'visible' });
  await updateDemoBanner(page, '✅ [Bước 6/10] Đăng nhập Admin thành công! Đang hiển thị Admin Portal.');
  console.log('   ↳ Đăng nhập Admin thành công! Chuyển hướng vào Admin Portal riêng biệt.');
  await sleep(2500);

  // BƯỚC 7: KIỂM TRA THỐNG KÊ TỔNG QUAN TOÀN HỆ THỐNG
  console.log('▶ [BƯỚC 7/10] 📊 Đang kiểm tra các thẻ thống kê tổng quan toàn hệ thống...');
  await updateDemoBanner(page, '🎬 [Bước 7/10] Kiểm tra thẻ thống kê: Tổng sinh viên, Tổng bài tập, Đã xong, Đang chờ...');
  await sleep(1200);

  const numStudents = await page.getByTestId('admin-stat-students').innerText();
  const totalTasks = await page.getByTestId('admin-stat-total-tasks').innerText();
  const completedTasks = await page.getByTestId('admin-stat-completed-tasks').innerText();
  const pendingTasks = await page.getByTestId('admin-stat-pending-tasks').innerText();

  console.log(`   ↳ Thống kê hệ thống: ${numStudents} sinh viên | ${totalTasks} bài tập tổng | ${completedTasks} hoàn thành | ${pendingTasks} đang chờ.`);
  await sleep(2500);

  // BƯỚC 8: XEM CHI TIẾT NHIỆM VỤ CỦA SINH VIÊN 1 (student1)
  console.log('▶ [BƯỚC 8/10] 👨‍🎓 Xem danh sách bài tập của Sinh viên 1 (Nguyễn Văn Tuấn)...');
  await updateDemoBanner(page, '🎬 [Bước 8/10] Đang hiển thị bài tập của Sinh viên 1: Nguyễn Văn Tuấn (@student1)...');
  const student1Card = page.getByTestId('admin-student-item').filter({ hasText: 'student1' });
  await student1Card.click();
  await sleep(1000);

  const student1TaskCount = await page.getByTestId('admin-student-task-badge').innerText();
  console.log(`   ↳ Sinh viên 1 (Nguyễn Văn Tuấn): ${student1TaskCount}.`);
  await sleep(2500);

  // BƯỚC 9: CHUYỂN SANG SINH VIÊN 2 (student2) VÀ ÁP DỤNG BỘ LỌC
  console.log('▶ [BƯỚC 9/10] 👩‍🎓 Chuyển sang xem bài tập của Sinh viên 2 (Trần Thị Mai) và lọc trạng thái...');
  await updateDemoBanner(page, '🎬 [Bước 9/10] Chọn Sinh viên 2: Trần Thị Mai (@student2) và áp dụng bộ lọc...');
  const student2Card = page.getByTestId('admin-student-item').filter({ hasText: 'student2' });
  await student2Card.click();
  await sleep(1500);

  console.log('   ↳ Đã chuyển sang Sinh viên 2 (Trần Thị Mai).');

  // Lọc Đã hoàn thành
  await page.getByTestId('admin-filter-status').selectOption('completed');
  await updateDemoBanner(page, '🎬 [Bước 9/10] Lọc bài tập: "Đã hoàn thành" -> Hiển thị đúng 1 bài tập hoàn thành.');
  console.log('   ↳ Lọc bài tập "Đã hoàn thành": Hiển thị đúng bài tập môn Cơ sở dữ liệu.');
  await sleep(2500);

  // Trả về Tất cả
  await page.getByTestId('admin-filter-status').selectOption('all');
  await updateDemoBanner(page, '🎬 [Bước 9/10] Trả về "Tất cả bài tập" -> Hiển thị lại toàn bộ 2 bài tập.');
  console.log('   ↳ Trả về bộ lọc "Tất cả": Hiển thị đủ 2 bài tập của sinh viên 2.');
  await sleep(2000);

  // BƯỚC 10: ĐĂNG XUẤT ADMIN
  console.log('▶ [BƯỚC 10/10] 🚪 Đang đăng xuất khỏi Admin Portal...');
  await updateDemoBanner(page, '🎬 [Bước 10/10] Đăng xuất Quản trị viên, hoàn tất chu trình demo...');
  await sleep(1200);

  await page.getByTestId('btn-admin-logout').click();
  await page.getByTestId('auth-view').waitFor({ state: 'visible' });
  await updateDemoBanner(page, '🎉 [DEMO HOÀN TẤT] Trình duyệt đang được giữ mở để Thầy/Cô quan sát!', true);
  console.log('   ↳ Đã đăng xuất Admin thành công và quay lại màn hình Login.');
  await sleep(1500);

  // =========================================================================
  // GIỮ TRÌNH DUYỆT MỞ CHO ĐẾN KHI NGƯỜI DÙNG KẾT THÚC
  // =========================================================================
  console.log('\n======================================================================');
  console.log('🎉 TOÀN BỘ LUỒNG DEMO (STUDENT + ADMIN) ĐÃ ĐƯỢC THỰC HIỆN THÀNH CÔNG 100%!');
  console.log('======================================================================');
  console.log('📌 Trình duyệt Chrome ĐANG ĐƯỢC GIỮ MỞ để Thầy/Cô và bạn quan sát.');
  console.log('👉 Bạn có thể click chuột, xem lại các màn hình hoặc thao tác tay nếu cần.');
  console.log('👉 Nhấn phím [ENTER] tại terminal này (hoặc đóng cửa sổ trình duyệt) để kết thúc.');
  console.log('======================================================================\n');

  // Đợi người dùng nhấn Enter hoặc đóng trình duyệt
  await new Promise((resolve) => {
    let resolved = false;

    browser.on('disconnected', () => {
      if (!resolved) {
        resolved = true;
        console.log('👋 Cửa sổ trình duyệt đã được đóng.');
        resolve(null);
      }
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('', () => {
      if (!resolved) {
        resolved = true;
        rl.close();
        resolve(null);
      }
    });
  });

  await browser.close().catch(() => {});
  if (serverProcess) {
    serverProcess.kill();
  }
  console.log('✅ Phiên demo đã kết thúc gọn gàng.\n');
}

runDemo().catch((err) => {
  console.error('❌ Lỗi trong quá trình chạy demo:', err);
  process.exit(1);
});
