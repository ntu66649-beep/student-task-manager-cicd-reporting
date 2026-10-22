// @ts-check
const { spawn, execSync } = require('child_process');
const path = require('path');

console.log('\n======================================================================');
console.log('⚠️ CHƯƠNG TRÌNH DEMO: PLAYWRIGHT PHÁT HIỆN LỖI (CONTROLLED ASSERTION FAILURE)');
console.log('======================================================================');
console.log('🎯 Mục đích: Trình diễn cho Giảng viên xem khả năng phát hiện lỗi tự động:');
console.log('   - So sánh sai lệch giữa Kỳ vọng (Expected) và Thực tế (Actual)');
console.log('   - Tự động chụp ảnh màn hình thời điểm xảy ra lỗi (Screenshot)');
console.log('   - Tự động ghi lại vết lỗi (Trace Viewer) và tạo Báo cáo HTML trực quan');
console.log('   - Tự động cập nhật báo cáo Allure Report với trạng thái FAILED');
console.log('📌 Kịch bản kiểm thử: Đăng nhập sai mật khẩu nhưng cố ý kiểm tra Dashboard visible.');
console.log('👉 LƯU Ý QUAN TRỌNG:');
console.log('   Kết quả FAILED và mã thoát khác 0 (exit code khác 0) của lệnh này là');
console.log('   HOÀN TOÀN CỐ Ý VÀ CÓ CHỦ ĐÍCH nhằm phục vụ mục đích trình diễn bắt lỗi!');
console.log('   Mã nguồn hệ thống KHÔNG hề bị sửa đổi hay hư hỏng.');
console.log('======================================================================\n');

const isHeadless = process.argv.includes('--headless');
const headedFlag = isHeadless ? '' : '--headed';

const cmd = process.platform === 'win32'
  ? `npx.cmd playwright test tests/demo_failure_report.spec.js ${headedFlag}`
  : `npx playwright test tests/demo_failure_report.spec.js ${headedFlag}`;

const child = spawn(cmd, {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, RUN_DEMO_FAIL: 'true' }
});

child.on('close', (code) => {
  console.log('\n======================================================================');
  console.log('🔍 TỔNG KẾT PHIÊN DEMO BẮT LỖI TỰ ĐỘNG CỦA PLAYWRIGHT:');
  console.log('======================================================================');
  console.log(`❌ Trạng thái kết thúc: FAILED (Exit code: ${code}) [ĐÚNG NHƯ KỲ VỌNG DEMO]`);
  console.log('📸 Ảnh chụp lỗi (Screenshot) đã được lưu tại thư mục: test-results/');
  console.log('📊 Báo cáo kiểm thử HTML Report đã được tạo tại: playwright-report/index.html');

  try {
    console.log('⚡ Đang tự động cập nhật Allure Report...');
    execSync('npx allure generate allure-results --clean -o allure-report', { stdio: 'ignore' });
    console.log('🌟 Đã xuất thành công Allure Report tại: allure-report/index.html');
  } catch (err) {
    console.log('⚠️ Chú ý: Chưa thể tự động xuất Allure Report. Bạn có thể chạy: npm run allure:generate');
  }

  console.log('\n💡 CÁCH XEM BÁO CÁO LỖI TRỰC QUAN CHO GIẢNG VIÊN:');
  console.log('   1. Xem Playwright HTML Report:  👉 npm run test:report');
  console.log('   2. Xem Allure Report:           👉 npm run allure:open');
  console.log('\n🔄 CÁCH KHÔI PHỤC KẾT QUẢ PASS 100%:');
  console.log('   👉 npm test');
  console.log('   (Không cần revert code, bộ test chính luôn pass 100% khi chạy bình thường!)');
  console.log('======================================================================\n');

  process.exit(code !== null ? code : 1);
});
