# 📊 BÁO CÁO KẾT QUẢ KIỂM THỬ (TEST EXECUTION REPORT)

**Tên dự án:** Student Task Manager – CI/CD & Reporting  
**Học phần:** SWT301 – Software Testing  
**Đối tượng kiểm thử:** Website Quản lý bài tập sinh viên (Student Task Manager)  
**Ngày thực hiện kiểm thử:** 21/10/2026  
**Môi trường thực thi kiểm thử:**
- Hệ điều hành: Windows 10/11 x64 / Linux Ubuntu Runner (CI/CD)
- Node.js Runtime: v24.21.0 (Local) / Node 20 LTS (GitHub Actions)
- Test Framework: `@playwright/test` v1.64.0
- Report Framework: `allure-playwright` v3.14.0 & `allure-commandline` v2.46.1
- Trình duyệt kiểm thử: Chromium 1248 (Headless & Headed)

---

## 📈 1. Bảng số liệu tổng hợp (Executive Summary)

| Chỉ số kiểm định | Số liệu thực tế | Tỷ lệ phần trăm | Ghi chú đánh giá |
| :--- | :---: | :---: | :--- |
| **Tổng số ca kiểm thử thiết kế** | **24** | 100% | Toàn bộ các luồng nghiệp vụ ứng dụng |
| **Số ca kiểm thử chính thức (Official)** | **23** | 95.8% | Bộ kiểm thử đánh giá chất lượng phần mềm |
| **Số ca kiểm thử ĐẠT (Passed)** | **23** | **100%** | **Đạt tuyệt đối trên bộ test chính thức** |
| **Số ca kiểm thử BỎ QUA (Skipped)** | **1** | 4.2% | `TC_DEMO_FAIL` tự động skip trong test chính |
| **Số ca kiểm thử THẤT BẠI (Failed)** | **0** | **0%** | Không phát hiện lỗi nghiêm trọng ngoài ý muốn |
| **Thời gian thực thi toàn bộ test suite** | **~17.6 giây** | - | Tốc độ thực thi trung bình: ~0.76s / test case |
| **Tỷ lệ bao phủ chức năng (Coverage)** | **100%** | - | Đăng nhập, CRUD bài tập, Admin, Lưu trữ |

---

## 🔍 2. Báo cáo chi tiết theo từng phân hệ chức năng

### 2.1. Phân hệ Xác thực & Phân quyền (Authentication: 5/5 PASSED - 100%)
*File thực thi: `tests/auth.spec.js`*

| Mã Test Case | Tên ca kiểm thử | Loại kiểm thử | Thời gian chạy | Trạng thái |
| :--- | :--- | :---: | :---: | :---: |
| **TC_AUTH_01** | Đăng nhập thành công với tài khoản và mật khẩu đúng | Positive | 638ms | ✅ **PASSED** |
| **TC_AUTH_02** | Báo lỗi khi để trống trường đăng nhập | Negative / Validation | 390ms | ✅ **PASSED** |
| **TC_AUTH_03** | Báo lỗi khi nhập sai mật khẩu | Negative / Validation | 536ms | ✅ **PASSED** |
| **TC_AUTH_04** | Báo lỗi khi tài khoản không tồn tại trong hệ thống | Negative / Validation | 505ms | ✅ **PASSED** |
| **TC_AUTH_05** | Đăng xuất tài khoản và quay về màn hình Đăng nhập | Positive | 673ms | ✅ **PASSED** |

> **Nhận xét chuyên môn:** Module xác thực xử lý chính xác cả luồng thành công và luồng ngoại lệ. Các thông báo lỗi tiếng Việt hiển thị rõ ràng, ngăn chặn hoàn toàn việc truy cập trái phép vào Dashboard khi chưa có thông tin hợp lệ.

---

### 2.2. Phân hệ Quản trị viên & Phân quyền (Admin Dashboard: 7/7 PASSED - 100%)
*File thực thi: `tests/admin.spec.js`*

| Mã Test Case | Tên ca kiểm thử | Loại kiểm thử | Thời gian chạy | Trạng thái |
| :--- | :--- | :---: | :---: | :---: |
| **TC_ADMIN_01**| Đăng nhập tài khoản Admin thành công và chuyển hướng Admin Dashboard | Positive | 996ms | ✅ **PASSED** |
| **TC_ADMIN_02**| Thống kê số lượng sinh viên và bài tập toàn hệ thống chính xác | Positive | 746ms | ✅ **PASSED** |
| **TC_ADMIN_03**| Hiển thị danh sách sinh viên kèm tiến độ hoàn thành | Positive | 736ms | ✅ **PASSED** |
| **TC_ADMIN_04**| Chọn từng sinh viên để xem chi tiết danh sách nhiệm vụ của sinh viên đó | Positive | 695ms | ✅ **PASSED** |
| **TC_ADMIN_05**| Lọc danh sách bài tập của sinh viên theo trạng thái | Positive | 871ms | ✅ **PASSED** |
| **TC_ADMIN_06**| Phân quyền: Sinh viên đăng nhập không hiển thị Admin Dashboard | Security / Boundary | 583ms | ✅ **PASSED** |
| **TC_ADMIN_07**| Đăng xuất khỏi Admin Dashboard quay về màn hình Đăng nhập | Positive | 806ms | ✅ **PASSED** |

> **Nhận xét chuyên môn:** Phân quyền vai trò (Role-Based Access Control) hoạt động chuẩn xác: tài khoản `admin` vào đúng màn hình thống kê toàn trường với 2 sinh viên và 5 bài tập; tài khoản `student1` bị giới hạn hoàn toàn trong phạm vi cá nhân và không thể mở giao diện quản trị.

---

### 2.3. Phân hệ Quản lý Nhiệm vụ Học tập (Task CRUD & Filters: 10/10 PASSED - 100%)
*File thực thi: `tests/tasks.spec.js`*

| Mã Test Case | Tên ca kiểm thử | Loại kiểm thử | Thời gian chạy | Trạng thái |
| :--- | :--- | :---: | :---: | :---: |
| **TC_TASK_01** | Hiển thị danh sách nhiệm vụ và các thẻ thống kê ban đầu | Positive | 662ms | ✅ **PASSED** |
| **TC_TASK_02** | Thêm mới nhiệm vụ thành công với dữ liệu hợp lệ | Positive | 836ms | ✅ **PASSED** |
| **TC_TASK_03** | Báo lỗi khi thêm nhiệm vụ mà không nhập tiêu đề | Negative / Validation | 750ms | ✅ **PASSED** |
| **TC_TASK_03B**| Báo lỗi khi chọn Deadline trong quá khứ và ngăn chặn lưu task | Negative / Validation | 652ms | ✅ **PASSED** |
| **TC_TASK_03C**| Thêm nhiệm vụ thành công khi chọn Deadline là ngày hôm nay | Boundary Value | 612ms | ✅ **PASSED** |
| **TC_TASK_04** | Đánh dấu hoàn thành nhiệm vụ (Mark Complete) | Positive | 705ms | ✅ **PASSED** |
| **TC_TASK_05** | Chuyển đổi trạng thái từ hoàn thành trở lại Đang chờ | Positive | 610ms | ✅ **PASSED** |
| **TC_TASK_06** | Xóa thành công một nhiệm vụ khỏi danh sách | Positive | 739ms | ✅ **PASSED** |
| **TC_TASK_07** | Lọc danh sách nhiệm vụ theo trạng thái (All / Pending / Done) | Positive | 621ms | ✅ **PASSED** |
| **TC_TASK_08** | Tìm kiếm theo từ khóa và hiển thị Empty State khi không có kết quả | Search / Boundary | 609ms | ✅ **PASSED** |

> **Nhận xét chuyên môn:** Chức năng trọng tâm của hệ thống vận hành hoàn hảo. Form có ràng buộc nghiệp vụ tốt (bắt buộc tiêu đề, không cho phép chọn deadline quá khứ nhưng chấp nhận deadline hôm nay). Các thao tác tương tác cập nhật số liệu thống kê ngay lập tức mà không cần F5 trang.

---

### 2.4. Phân hệ Độ bền Dữ liệu & Lưu trữ (Data Persistence: 1/1 PASSED - 100%)
*File thực thi: `tests/persistence.spec.js`*

| Mã Test Case | Tên ca kiểm thử | Loại kiểm thử | Thời gian chạy | Trạng thái |
| :--- | :--- | :---: | :---: | :---: |
| **TC_PERSIST_01**| Duy trì phiên đăng nhập và dữ liệu nhiệm vụ sau khi F5 trang | Reliability | 614ms | ✅ **PASSED** |

> **Nhận xét chuyên môn:** Dữ liệu người dùng và danh sách bài tập được lưu trữ bền vững trong `localStorage`. Khi trình duyệt reload (F5), phiên làm việc của sinh viên vẫn được duy trì liên tục, các bài tập mới tạo không bị mất.

---

### 2.5. Phân hệ Demo Bắt lỗi có Kiểm soát (Controlled Failure Demo: 1/1 VERIFIED)
*File thực thi: `tests/demo_failure_report.spec.js`*

| Mã Test Case | Tên ca kiểm thử | Chế độ kích hoạt | Kết quả ghi nhận | Trạng thái nghiệm thu |
| :--- | :--- | :---: | :---: | :---: |
| **TC_DEMO_FAIL**| Cố ý so khớp sai để chứng minh khả năng phát hiện lỗi của Playwright | `npm test` thông thường | 1 skipped | ✅ **SKIPPED (Bảo toàn Pass)** |
| **TC_DEMO_FAIL**| Cố ý so khớp sai để chứng minh khả năng phát hiện lỗi của Playwright | `npm run demo:fail` | 1 failed (4.5s) | ✅ **CONTROLLED FAILED (Đạt kỳ vọng)** |

- **Bằng chứng lỗi tự động thu thập:**
  - Ảnh chụp màn hình lỗi (Screenshot): `test-results/.../test-failed-1.png`
  - Video ghi lại toàn bộ hành động: `test-results/.../video.webm`
  - Vết kiểm thử chi tiết: `test-results/.../trace.zip`
  - Ngữ cảnh lỗi (Error Context): `test-results/.../error-context.md`
- **Kết luận:** Cơ chế phát hiện lỗi và lưu trữ bằng chứng tự động đạt độ chính xác 100%, sẵn sàng phục vụ trình diễn trước Giảng viên.

---

## 📑 3. Đánh giá chất lượng các hệ thống Báo cáo (Reporting Systems)

### 3.1. Báo cáo Playwright HTML Report
- **Đường dẫn tệp:** `playwright-report/index.html` (Dung lượng: ~550 KB, chứa toàn bộ assets độc lập).
- **Tính năng nổi bật đã kiểm chứng:**
  - Hiển thị danh sách toàn bộ 23 ca kiểm thử Passed với biểu tượng màu xanh lá.
  - Call log chi tiết từng hành động (goto, fill, click, expect) với thời gian tính bằng mili-giây.
  - Tích hợp Trace Viewer cho phép tua lại từng frame hành động của trình duyệt khi debug.

### 3.2. Báo cáo Allure Report
- **Đường dẫn thư mục:** `allure-report/` (Biên dịch từ `allure-results/`).
- **Lệnh mở trực tiếp:** `npm run allure:open` (hoặc `npm run allure:serve`).
- **Các chỉ số trên Allure Report:**
  - **Overview Dashboard:** Biểu đồ tròn thể hiện 100% Passed cho các bài test chính thức.
  - **Behaviors / Epics:** Cấu trúc phân cấp theo từng tính năng nghiệp vụ rõ ràng.
  - **Timeline:** Biểu đồ Gantt phân bổ thời gian thực thi tuần tự, chứng minh không có xung đột trạng thái dữ liệu.
  - **Suites:** Hiển thị 5 bộ test tương ứng 5 file spec rõ ràng.

---

## 🚀 4. Đánh giá đường ống CI/CD GitHub Actions

Đường ống tích hợp liên tục được cấu hình tại file [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml) với các tiêu chí chất lượng:
1. **Khả năng tự động hóa:** Chạy tự động 100% trên môi trường đám mây Ubuntu Runner khi có commit `push` hoặc tạo `pull_request`.
2. **Quản lý phụ thuộc chuẩn mực:** Cài đặt Node 20, Java JDK 17 (Temurin), Playwright Chromium và các gói npm độc lập.
3. **Bảo toàn bằng chứng kiểm thử:** Thiết lập cấu hình `if: always()` trên tất cả các bước xuất báo cáo và upload artifact, đảm bảo báo cáo Playwright và Allure luôn được lưu trữ ngay cả khi có bài test bị fail.
4. **Thời gian lưu trữ Artifacts:** Lưu trữ Playwright Report và Allure Report tĩnh trong 30 ngày trên GitHub.

---

## 🏆 5. Đánh giá chất lượng phần mềm theo tiêu chuẩn ISO/IEC 25010

| Tiêu chuẩn chất lượng | Mức độ đạt được | Phân tích chi tiết |
| :--- | :---: | :--- |
| **Tính đúng đắn (Functional Correctness)** | **100%** | Toàn bộ 23 test case nghiệp vụ cốt lõi đều trả về kết quả chính xác theo yêu cầu đặc tả. |
| **Tính tin cậy & Bền vững (Reliability)** | **100%** | Dữ liệu phiên và nhiệm vụ không bị mất khi reload (F5); form chặn thành công deadline quá khứ. |
| **Hiệu năng thực thi (Performance Efficiency)** | **Cao** | Toàn bộ 23 bài test hoàn thành trong chưa đầy 18 giây (~0.76s / test). |
| **Tính an toàn & Phân quyền (Security)** | **Tốt** | Phân định ranh giới rõ ràng giữa vai trò Sinh viên và vai trò Admin; thông báo lỗi không để lộ thông tin nhạy cảm. |
| **Khả năng bảo trì & Mở rộng (Maintainability)** | **Cao** | Bộ chọn Playwright sử dụng thuộc tính `data-testid` chuẩn mực, test suite độc lập nhờ `localStorage.clear()` trước mỗi bài test. |

---

## 🎯 6. Kết luận và Đề xuất

1. **Kết luận:**
   - Dự án **Student Task Manager – CI/CD & Reporting** đã hoàn thành 100% các yêu cầu kỹ thuật và nghiệp vụ của môn học **SWT301**.
   - Bộ mã nguồn website gốc được giữ nguyên bản tuyệt đối, không có bất kỳ thay đổi nào về giao diện hay thành phần trang trí.
   - Hệ thống báo cáo kép (**Playwright HTML Report** và **Allure Report**) cùng đường ống **GitHub Actions CI/CD** vận hành ổn định, sẵn sàng cho buổi bảo vệ đồ án chính thức.

2. **Đề xuất cho buổi bảo vệ:**
   - Nhóm sinh viên thực hiện diễn tập theo đúng kịch bản [`DEMO_GUIDE.md`](file:///DEMO_GUIDE.md).
   - Tự tin trình diễn kịch bản Bắt lỗi có kiểm soát (`npm run demo:fail`) để nêu bật khả năng quan sát và lưu vết lỗi tự động của Playwright và Allure trước Hội đồng chấm thi.
