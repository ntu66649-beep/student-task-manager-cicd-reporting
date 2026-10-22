# 🎓 Student Task Manager – CI/CD & Reporting (Môn SWT301)

Dự án kiểm thử tự động toàn diện **End-to-End (E2E) Testing**, tích hợp đường ống tích hợp liên tục **CI/CD Pipeline với GitHub Actions** và hệ thống báo cáo chuyên nghiệp **Allure Report & Playwright HTML Report** cho ứng dụng web **Student Task Manager**.

Dự án phục vụ học phần **SWT301 – Software Testing** tại trường Đại học FPT.

---

## 📌 1. Giới thiệu tổng quan

Website **Student Task Manager** là ứng dụng web quản lý tiến độ bài tập và nhiệm vụ học tập dành cho sinh viên, hỗ trợ 2 vai trò: **Sinh viên (Student)** và **Quản trị viên (Admin / Giảng viên)**.

### ✨ Mục tiêu dự án
1. **Kiểm thử tự động E2E**: Xây dựng bộ test case Playwright tự động kiểm thử toàn bộ các chức năng quan trọng: Xác thực (Login/Logout), Quản lý bài tập (Task CRUD), Phân quyền và Thống kê quản trị (Admin Dashboard), Độ bền dữ liệu (Session Persistence).
2. **Báo cáo chuyên nghiệp đa nền tảng**: Tích hợp đồng thời **Playwright HTML Report** (kèm Screenshot, Video, Trace Viewer) và **Allure Report** (giao diện phân tích đa chiều, biểu đồ trực quan, phân loại defect).
3. **Đường ống CI/CD tự động hóa**: Cấu hình **GitHub Actions Workflow** tự động kích hoạt khi có commit `push` hoặc tạo `pull_request`, tự động cài đặt môi trường (Node.js, Java JDK cho Allure CLI, Playwright Chromium), thực thi kiểm thử và lưu trữ Artifacts báo cáo.
4. **Kịch bản Demo có kiểm soát (Controlled PASS & FAIL)**: Cung cấp kịch bản trình diễn trực quan cho Giảng viên xem khả năng phát hiện lỗi, tự động chụp ảnh màn hình và khôi phục nhanh chóng mà không làm ảnh hưởng hay sửa đổi mã nguồn.

---

## 🛠️ 2. Công nghệ và công cụ sử dụng

| Phân hệ / Công cụ | Công nghệ sử dụng | Mục đích / Vai trò |
| :--- | :--- | :--- |
| **Frontend Web** | HTML5, CSS3 Semantic, Vanilla JavaScript (ES6+) | Giao diện gốc nguyên bản, không dùng framework ngoài, lưu trữ qua `localStorage` |
| **Local Web Server** | Node.js Native HTTP Server (`server.js`) | Phục vụ ứng dụng tại `http://localhost:3000` không phụ thuộc thư viện thứ ba |
| **E2E Automation** | [Playwright Test](https://playwright.dev/) (`@playwright/test`) | Framework kiểm thử thế hệ mới, chạy trên trình duyệt Chromium Headless & Headed |
| **Allure Framework** | `allure-playwright`, `allure-commandline` | Bộ công cụ báo cáo kiểm thử tiêu chuẩn quốc tế, trực quan hóa biểu đồ và timeline |
| **CI/CD Platform** | GitHub Actions (`.github/workflows/ci.yml`) | Tự động hóa kiểm thử trên môi trường Ubuntu Runner, xuất và lưu trữ artifacts |
| **Runtime & Môi trường** | Node.js >= 18, Java JDK >= 11 (dành cho Allure CLI) | Nền tảng thực thi ứng dụng và công cụ tạo báo cáo |

---

## 📁 3. Cấu trúc thư mục dự án

```text
student-task-manager-cicd-reporting/
├── .github/
│   └── workflows/
│       └── ci.yml               # Cấu hình GitHub Actions CI/CD Pipeline
├── src/                         # Mã nguồn giao diện Website gốc (giữ nguyên bản)
│   ├── index.html               # Trang giao diện chính (Auth View, Student View, Admin View)
│   ├── css/
│   │   └── style.css            # Toàn bộ CSS giao diện
│   └── js/
│       └── app.js               # Logic nghiệp vụ ứng dụng và lưu trữ dữ liệu
├── tests/                       # Bộ kiểm thử tự động E2E với Playwright
│   ├── auth.spec.js             # Test case Đăng nhập, Đăng xuất, Validation lỗi (5 tests)
│   ├── tasks.spec.js            # Test case Thêm, Xem, Sửa, Xóa, Lọc, Tìm kiếm bài tập (10 tests)
│   ├── admin.spec.js            # Test case Admin Dashboard, Thống kê, Phân quyền (7 tests)
│   ├── persistence.spec.js      # Test case Độ bền dữ liệu sau khi F5 reload trang (1 test)
│   └── demo_failure_report.spec.js # Test case mô phỏng lỗi có kiểm soát để demo Giảng viên (1 test)
├── demo.js                      # Kịch bản demo Headed tự động hoàn chỉnh với banner trực quan
├── demo-failure.js              # Kịch bản demo bắt lỗi có kiểm soát & cập nhật Allure Report
├── server.js                    # Máy chủ Web HTTP phục vụ ứng dụng tại cổng 3000
├── playwright.config.js          # File cấu hình Playwright (Reporters, webServer, Trace, Viewport)
├── package.json                 # Khai báo cấu hình npm, dependencies & scripts
├── .gitignore                   # Loại trừ node_modules, reports và artifacts khỏi Git
├── README.md                    # Tài liệu hướng dẫn tổng quan dự án
├── TEST_CASES.md                # Đặc tả 24 ca kiểm thử chi tiết (Steps, Expected, Actual)
├── TEAM_TASKS.md                # Bảng phân chia công việc cho 4 thành viên nhóm
├── DEMO_GUIDE.md                # Kịch bản hướng dẫn thuyết trình và demo bảo vệ đồ án
└── TEST_REPORT.md               # Báo cáo tổng kết kết quả kiểm thử chính thức
```

---

## 🔑 4. Danh sách tài khoản thử nghiệm

| Tên đăng nhập (`username`) | Mật khẩu (`password`) | Vai trò (`Role`) | Chức năng truy cập |
| :--- | :--- | :--- | :--- |
| `student1` | `123456` | Sinh viên (Nguyễn Văn Tuấn) | Dashboard Sinh viên: xem bài tập, thêm bài tập, đánh dấu hoàn thành, xóa, tìm kiếm |
| `student2` | `123456` | Sinh viên (Trần Thị Mai) | Dashboard Sinh viên: dữ liệu bài tập riêng biệt của student2 |
| `admin` | `admin123` | Quản trị viên (Giảng viên) | Admin Dashboard: xem số liệu toàn trường, danh sách sinh viên, tiến độ và chi tiết từng bài tập |

---

## 🚀 5. Hướng dẫn cài đặt và chạy trên máy cục bộ (Local)

### 5.1. Yêu cầu môi trường
- **Node.js**: Phiên bản 18 trở lên (Khuyến nghị: Node 20 LTS hoặc v24).
- **Java JDK**: Phiên bản 8, 11, 17 hoặc 21 (Cần thiết để Allure Commandline biên dịch báo cáo).
- **Trình duyệt**: Playwright Chromium (tự động cài đặt thông qua lệnh bên dưới).

### 5.2. Cài đặt các gói phụ thuộc
Mở Terminal / PowerShell tại thư mục dự án và thực hiện:

```bash
# 1. Cài đặt các thư viện (Playwright, Allure Playwright, Allure CLI)
npm install

# 2. Cài đặt trình duyệt Playwright Chromium kèm các thư viện hệ thống
npx playwright install chromium
```

### 5.3. Khởi động Web Server (Tùy chọn khi muốn duyệt web thủ công)
```bash
npm start
```
Truy cập ứng dụng tại: `http://localhost:3000`  
*(Lưu ý: Khi chạy kiểm thử tự động, Playwright sẽ tự động khởi động server thông qua cấu hình `webServer` trong `playwright.config.js`).*

---

## 🧪 6. Hướng dẫn thực thi kiểm thử và xuất báo cáo

### 6.1. Chạy toàn bộ kiểm thử E2E chính thức (Headless Mode)
Chạy toàn bộ 23 ca kiểm thử chính thức ở chế độ chạy ngầm (Headless), tự động lưu kết quả cho HTML Report và Allure Report:

```bash
npm test
```
*Kết quả chuẩn: `23 passed, 1 skipped` (bài test demo lỗi mặc định được skip để đảm bảo tính toàn vẹn của kết quả).*

### 6.2. Chạy kiểm thử có hiển thị trình duyệt (Headed Mode)
```bash
npm run test:headed
```

### 6.3. Chạy kiểm thử với giao diện tương tác Playwright UI Mode
```bash
npm run test:ui
```

---

## 📊 7. Xem báo cáo kiểm thử (Playwright Report & Allure Report)

Dự án hỗ trợ xuất đồng thời 2 loại báo cáo kiểm thử mạnh mẽ nhất hiện nay:

### 7.1. Xem Playwright HTML Report
```bash
npm run test:report
```
Trình duyệt sẽ tự động mở trang báo cáo `playwright-report/index.html`. Báo cáo hiển thị:
- Danh sách 23 test case đạt chuẩn.
- Thời gian chạy từng bước (call log, timing).
- Xem ảnh chụp màn hình, video và vết kiểm thử (Playwright Trace Viewer) khi có lỗi.

### 7.2. Xuất và xem Allure Report
```bash
# Bước 1: Biên dịch dữ liệu thô từ allure-results thành trang tĩnh HTML
npm run allure:generate

# Bước 2: Khởi chạy máy chủ nội bộ mở giao diện Allure Report
npm run allure:open
```
Hoặc chạy lệnh gộp trực tiếp:
```bash
npm run allure:serve
```
Giao diện Allure Report cung cấp:
- **Overview Dashboard**: Biểu đồ hình tròn phân bố tỷ lệ Pass/Fail, mức độ nghiêm trọng (Severity).
- **Behaviors / Epics**: Phân cấp theo từng tính năng (Authentication, Task Management, Admin Dashboard).
- **Timeline**: Biểu đồ Gantt thể hiện chi tiết thời gian chạy tuần tự giữa các test case.
- **Suites & Packages**: Danh sách phân cấp theo từng file spec.

---

## 🎬 8. Kịch bản Demo dành cho Giảng viên (PASS & FAIL)

Để phục vụ tốt nhất cho buổi bảo vệ đồ án, dự án xây dựng 2 kịch bản demo chuyên dụng:

### 🌟 Kịch bản 1: Demo tự động hoàn chỉnh luồng nghiệp vụ (PASS 100%)
Lệnh thực thi:
```bash
npm run demo:pass
# hoặc:
npm run demo
```
- Trình duyệt Chromium mở lên với chế độ chạy chậm trực quan (`slowMo: 300ms`).
- Banner nổi gắn ở chân trang hiển thị trạng thái từng bước bằng Tiếng Việt.
- Tự động đi qua trọn vẹn cả 2 phân hệ: **Sinh viên** (Đăng nhập -> Thêm bài tập -> Đánh dấu hoàn thành -> Lọc -> Tìm kiếm -> Xóa -> Đăng xuất) và **Admin** (Đăng nhập -> Thống kê hệ thống -> Xem từng sinh viên -> Lọc bài tập -> Đăng xuất).
- Trình duyệt được giữ mở sau khi hoàn tất để Giảng viên kiểm tra trực tiếp.

### ⚠️ Kịch bản 2: Demo khả năng phát hiện lỗi tự động (Controlled FAIL)
Lệnh thực thi:
```bash
npm run demo:fail
```
- **Hiện tượng**: Thực hiện kiểm thử đăng nhập sai mật khẩu nhưng cố ý so khớp mong muốn Dashboard hiển thị (`toBeVisible`).
- **Phản ứng của Playwright**: Phát hiện `Expected: visible, Received: hidden`, dừng test, đánh dấu FAILED (Exit code 1).
- **Hành động tự động**: Tự động chụp ảnh màn hình lỗi tại `test-results/`, ghi lại video và trace.
- **Tự động cập nhật báo cáo**: Tự động cập nhật Allure Report và Playwright Report với trạng thái FAILED đỏ rực.
- **Xem ngay báo cáo lỗi**:
  - `npm run test:report`
  - `npm run allure:open`
- **Khôi phục trạng thái 100% PASS**:
  - Chạy lại lệnh: `npm test`
  - *Không cần sửa mã nguồn, không làm bẩn Git, trạng thái trở lại 23 PASSED ngay lập tức!*

---

## ⚙️ 9. Cấu hình GitHub Actions CI/CD Pipeline

File cấu hình tại: [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml)

### Cơ chế hoạt động:
1. **Sự kiện kích hoạt**:
   - Tự động kích hoạt khi có commit `push` lên nhánh `main` hoặc `master`.
   - Tự động kích hoạt khi tạo `pull_request` vào nhánh `main` hoặc `master`.
   - Hỗ trợ kích hoạt thủ công thông qua nút **Run workflow** (`workflow_dispatch`).
2. **Các bước thực thi trên môi trường Ubuntu Runner**:
   - `actions/checkout@v4`: Kéo mã nguồn mới nhất.
   - `actions/setup-node@v4`: Khởi tạo môi trường Node.js 20 LTS.
   - `actions/setup-java@v4`: Khởi tạo môi trường Java JDK 17 (Temurin) để Allure CLI hoạt động.
   - `npm ci || npm install`: Cài đặt toàn bộ dependencies.
   - `npx playwright install --with-deps chromium`: Tải trình duyệt Chromium trên Linux.
   - `npm test`: Thực thi toàn bộ bộ test case E2E.
   - `npm run allure:generate`: Biên dịch báo cáo Allure Report tĩnh (`allure-report/`).
   - `actions/upload-artifact@v4`: Lưu trữ 4 bộ artifacts (lưu trữ 14 - 30 ngày) ngay cả khi có test fail (`if: always()`):
     - `playwright-report` (Báo cáo Playwright HTML).
     - `allure-report` (Báo cáo Allure HTML tĩnh hoàn chỉnh).
     - `allure-results` (Dữ liệu JSON thô của Allure).
     - `test-failure-results` (Ảnh chụp lỗi & vết trace khi có sự cố).

---

## 👥 10. Phân công công việc nhóm (4 Thành viên)

Dự án được phân bổ công việc đồng đều (mỗi thành viên 25%) theo ma trận kỹ năng:

| Thành viên | Vai trò | Nhiệm vụ chính | Sản phẩm đầu ra |
| :--- | :--- | :--- | :--- |
| **Thành viên 1** | Trưởng nhóm / CI/CD & Allure Engineer | Thiết lập cấu trúc dự án, cấu hình GitHub Actions CI/CD, tích hợp Allure Playwright & Allure CLI, quản lý artifacts | `.github/workflows/ci.yml`, `playwright.config.js`, `package.json` |
| **Thành viên 2** | QA Engineer (Auth & Admin) | Phát triển test case cho Module Đăng nhập/Đăng xuất và Phân quyền Quản trị Admin Dashboard | `tests/auth.spec.js`, `tests/admin.spec.js` |
| **Thành viên 3** | QA Engineer (Task CRUD & Storage) | Phát triển test case cho Module Quản lý bài tập (CRUD, Deadline, Lọc, Tìm kiếm) và Độ bền dữ liệu | `tests/tasks.spec.js`, `tests/persistence.spec.js` |
| **Thành viên 4** | QA & Reporting / Demo Specialist | Xây dựng kịch bản demo (PASS slowMo banner & Controlled FAIL), biên soạn bộ 5 tài liệu kỹ thuật | `demo.js`, `demo-failure.js`, bộ tài liệu Markdown |

Chi tiết xem tại tài liệu: [`TEAM_TASKS.md`](file:///TEAM_TASKS.md).

---

## 📑 11. Danh mục tài liệu tham khảo dự án

- [Đặc tả 24 Test Cases chi tiết (`TEST_CASES.md`)](file:///TEST_CASES.md)
- [Bảng phân chia công việc nhóm 4 thành viên (`TEAM_TASKS.md`)](file:///TEAM_TASKS.md)
- [Hướng dẫn kịch bản thuyết trình và Demo bảo vệ đồ án (`DEMO_GUIDE.md`)](file:///DEMO_GUIDE.md)
- [Báo cáo kết quả kiểm thử chính thức (`TEST_REPORT.md`)](file:///TEST_REPORT.md)
