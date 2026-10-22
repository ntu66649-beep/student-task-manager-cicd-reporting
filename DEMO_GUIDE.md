# 🎬 HƯỚNG DẪN KỊCH BẢN THUYẾT TRÌNH VÀ DEMO BẢO VỆ ĐỒ ÁN (DEMO GUIDE)

**Học phần:** SWT301 – Software Testing  
**Dự án:** Student Task Manager – CI/CD & Reporting  
**Mục đích:** Hướng dẫn chi tiết từng bước cho nhóm sinh viên khi thuyết trình và thực hiện Live Demo trước Giảng viên hướng dẫn / Hội đồng chấm thi.

---

## 📋 1. Checklist chuẩn bị trước giờ bảo vệ

Trước khi bắt đầu bài thuyết trình, nhóm cần kiểm tra nhanh các mục sau trên máy tính trình chiếu:
- [x] Đã cài đặt Node.js (`node -v` hiển thị `>= 18.0.0`).
- [x] Đã cài đặt Java JDK (`java -version` hiển thị Java 8, 11, 17 hoặc 21 để phục vụ Allure CLI).
- [x] Đã tải sẵn trình duyệt Playwright (`npx playwright install chromium`).
- [x] Cổng `3000` đang trống (không bị ứng dụng khác chiếm giữ).
- [x] Đã chạy `npm install` hoàn tất, thư mục `node_modules` đầy đủ.
- [x] Mở sẵn 2 tab Terminal: một tab chạy lệnh kiểm thử, một tab chạy máy chủ báo cáo.
- [x] Mở sẵn giao diện GitHub Repository của nhóm tại tab **Actions** trên trình duyệt.

---

## 🌟 PHẦN 1: DEMO LUỒNG PASS TOÀN DIỆN (INTERACTIVE HEADED DEMO)

### 1.1. Mục đích trình diễn
Chứng minh hệ thống kiểm thử tự động vận hành mượt mà trên toàn bộ các tính năng nghiệp vụ của ứng dụng: từ tài khoản Sinh viên đến tài khoản Quản trị viên, có hiển thị banner tiến trình trực quan theo thời gian thực.

### 1.2. Lệnh thực thi tại Terminal
```bash
npm run demo:pass
# (Hoặc lệnh ngắn gọn):
npm run demo
```

### 1.3. Diễn biến trên màn hình và lời thoại thuyết trình mẫu

| Bước thực hiện | Hiện tượng hiển thị trên màn hình | Lời thoại thuyết trình gợi ý cho sinh viên |
| :---: | :--- | :--- |
| **BƯỚC 1** | Trình duyệt Chromium mở lên tại `http://localhost:3000`. Banner chân trang hiện: `[Bước 1/10] Tự động đăng nhập tài khoản Sinh viên: student1...`. Các trường username/password được tự động gõ. | *"Thưa Thầy/Cô, hệ thống đang tự động đăng nhập với tài khoản sinh viên Nguyễn Văn Tuấn. Playwright mô phỏng thao tác gõ phím chân thực và xác thực đăng nhập thành công."* |
| **BƯỚC 2** | Vào Dashboard sinh viên. Form thêm bài tập được tự động điền đầy đủ tiêu đề, chọn môn học, mức độ ưu tiên Cao, hạn nộp 3 ngày sau. Nhấn Lưu nhiệm vụ. | *"Hệ thống tự động thêm một nhiệm vụ mới kèm hạn nộp trong tương lai. Bài tập mới xuất hiện ngay đầu danh sách và tổng số lượng tăng lên 4."* |
| **BƯỚC 3** | Thao tác đánh dấu hoàn thành bài tập đầu tiên. Class `.completed` được thêm, chữ bị gạch ngang. | *"Playwright thực hiện thao tác click nút check hoàn thành. Số lượng bài tập hoàn thành lập tức nhảy từ 1 lên 2 trên thẻ thống kê."* |
| **BƯỚC 4** | Thao tác bỏ hoàn thành bài tập thứ 2 (đưa về lại Đang chờ). | *"Hệ thống kiểm tra tính năng đảo ngược trạng thái, đưa bài tập đã làm xong về lại trạng thái chờ giải quyết."* |
| **BƯỚC 5** | Thao tác xóa bài tập đầu tiên. Toast thông báo xuất hiện, bài tập biến mất, tổng bài tập giảm về 3. | *"Kiểm tra chức năng xóa nhiệm vụ, toast thông báo phản hồi tức thì và cập nhật DOM an toàn."* |
| **BƯỚC 6** | Thao tác lọc bài tập: lần lượt chuyển bộ lọc sang 'Đã hoàn thành', 'Đang chờ' và 'Tất cả'. | *"Hệ thống kiểm thử bộ lọc danh sách theo từng trạng thái hoàn thành và đang chờ."* |
| **BƯỚC 7** | Gõ từ khóa tìm kiếm vào ô Search. Kiểm tra bài tập lọc đúng theo từ khóa. | *"Thử nghiệm tìm kiếm bài tập theo từ khóa môn học và tên nhiệm vụ trong thời gian thực."* |
| **BƯỚC 8** | Nhấn nút Đăng xuất của Sinh viên. Màn hình Dashboard đóng lại, quay về màn hình Đăng nhập. | *"Sinh viên đăng xuất an toàn, phiên làm việc được dọn dẹp sạch sẽ."* |
| **BƯỚC 9** | Tự động đăng nhập tài khoản Quản trị viên (`admin / admin123`). Chuyển hướng sang Admin Dashboard. | *"Tiếp theo là phân hệ Quản trị viên. Hệ thống tự động chuyển sang Admin Dashboard hiển thị thống kê tổng thể toàn trường: 2 sinh viên và 5 bài tập."* |
| **BƯỚC 10** | Admin click chọn sinh viên 2 (Trần Thị Mai) để xem chi tiết danh sách bài tập riêng. Đăng xuất Admin. | *"Admin theo dõi tiến độ chi tiết của từng sinh viên trong lớp học, sau đó đăng xuất an toàn."* |

### 1.4. Điểm nhấn chốt hạ cho Giảng viên
Sau khi hoàn tất 10 bước, script sẽ **giữ nguyên cửa sổ trình duyệt mở** kèm dòng thông báo:
> *"Thưa Thầy/Cô, toàn bộ quy trình đã chạy thành công 100%. Hiện tại cửa sổ trình duyệt đang được giữ mở, Thầy/Cô có thể trực tiếp click chuột hoặc kiểm tra bất kỳ thành phần nào trên giao diện."*
- Khi Giảng viên kiểm tra xong, sinh viên chỉ cần nhấn phím **Enter** trên Terminal để kết thúc phiên demo gọn gàng.

---

## ⚠️ PHẦN 2: DEMO BẮT LỖI TỰ ĐỘNG CÓ KIỂM SOÁT (CONTROLLED FAIL)

### 2.1. Mục đích trình diễn
Chứng minh cho Giảng viên thấy năng lực kiểm thử thực tế của Playwright và Allure:
1. So sánh sai lệch giữa Kỳ vọng (**Expected**) và Thực tế (**Actual**).
2. Tự động chụp ảnh thời điểm xảy ra lỗi (**Screenshot on Failure**).
3. Ghi lại vết lỗi (**Trace Viewer**) và video.
4. Tự động phản ánh lỗi lên báo cáo **Playwright HTML Report** và **Allure Report** với trạng thái **FAILED**.
5. **Cơ chế kiểm soát an toàn:** Không làm hỏng mã nguồn, khôi phục trạng thái 100% PASS tức thì.

### 2.2. Lệnh thực thi tại Terminal
```bash
npm run demo:fail
```

### 2.3. Lời giải thích với Giảng viên
> *"Thưa Thầy/Cô, trong thực tế kiểm thử, việc phát hiện lỗi và lưu trữ bằng chứng lỗi mới là giá trị cốt lõi. Nhóm xin phép thực hiện kịch bản bắt lỗi có kiểm soát: Chúng em nhập sai mật khẩu nhưng cố ý đặt Assertion mong đợi Dashboard phải hiển thị. Lệnh này sẽ trả về kết quả FAILED (Exit code 1) đúng như chủ đích thiết kế để chứng minh cơ chế bảo vệ của Playwright."*

### 2.4. Quan sát kết quả trên Terminal
Terminal sẽ in ra vết lỗi chi tiết:
```text
Error: expect(locator).toBeVisible() failed
Locator:  getByTestId('dashboard-view')
Expected: visible
Received: hidden
Timeout:  3500ms

attachment #1: screenshot (image/png) -> test-results/.../test-failed-1.png
attachment #2: video (video/webm)     -> test-results/.../video.webm
attachment #4: trace (application/zip)-> test-results/.../trace.zip
```

---

## 📊 PHẦN 3: XEM BÁO CÁO LỖI TRỰC QUAN (PLAYWRIGHT & ALLURE)

Ngay sau khi chạy kịch bản Fail ở Phần 2, sinh viên mở báo cáo cho Giảng viên quan sát:

### 3.1. Mở Playwright HTML Report
```bash
npm run test:report
```
- **Chỉ điểm cho Giảng viên xem:**
  1. Mục đỏ rực: `TC_DEMO_FAIL: Cố ý so khớp sai để chứng minh khả năng phát hiện lỗi của Playwright`.
  2. Bấm vào chi tiết: Chỉ rõ dòng code bị lỗi (`expect(page.getByTestId('dashboard-view')).toBeVisible()`).
  3. Chỉ vào ảnh chụp màn hình đính kèm: Thấy rõ màn hình vẫn ở trang Đăng nhập có dòng chữ đỏ *"Tên đăng nhập hoặc mật khẩu không chính xác!"*, chứng minh hệ thống từ chối truy cập chuẩn xác.

### 3.2. Mở Allure Report
```bash
npm run allure:open
```
- **Chỉ điểm cho Giảng viên xem:**
  1. Biểu đồ tổng quan (Overview): Có 1 test case màu đỏ (**Failed**).
  2. Tab **Behaviors**: Phân loại theo Story/Feature.
  3. Tab **Suites**: Xem chi tiết call steps và thời gian thực thi (execution duration).
  4. Phần **Defects**: Allure tự động gom nhóm lỗi theo nguyên nhân `AssertionError`.

---

## 🔄 PHẦN 4: KHÔI PHỤC KẾT QUẢ PASS 100% (INSTANT RECOVERY)

### 4.1. Thực hiện khôi phục
Chỉ cần chạy lệnh kiểm thử chính thức:
```bash
npm test
```

### 4.2. Giải thích với Giảng viên
> *"Thưa Thầy/Cô, cơ chế của nhóm chúng em thiết kế hoàn toàn cô lập: Bài test demo lỗi được kích hoạt qua cờ môi trường riêng biệt. Khi chạy `npm test` thông thường, hệ thống tự động skip bài test lỗi này, kết quả lập tức trở về trạng thái xanh hoàn hảo: **23 passed, 1 skipped**, mã nguồn hệ thống hoàn toàn nguyên vẹn mà không cần revert Git."*

---

## ☁️ PHẦN 5: DEMO ĐƯỜNG ỐNG CI/CD TRÊN GITHUB ACTIONS

### 5.1. Các bước trình diễn trên giao diện Web
1. Mở trình duyệt chuyển sang tab **Actions** trên GitHub Repository của nhóm.
2. Giới thiệu tên Workflow: **Student Task Manager E2E Test & Allure CI/CD Pipeline**.
3. Bấm vào lần chạy gần nhất (Commit mới nhất hoặc chạy thử bằng nút **Run workflow** -> **workflow_dispatch**).
4. Mở chi tiết Job `e2e-tests`:
   - Bước **Setup Java JDK 17 (Required by Allure CLI)**: Giải thích lý do cần Java để Allure Commandline biên dịch báo cáo tĩnh.
   - Bước **Run Playwright E2E Tests**: Toàn bộ 23 tests chạy thành công trên Ubuntu Runner.
   - Bước **Generate Allure Static HTML Report**: Tự động tạo thư mục `allure-report/`.
   - Các bước **Upload Artifact**: 4 gói artifacts được lưu trữ an toàn:
     - `playwright-report`
     - `allure-report`
     - `allure-results`
     - `test-failure-results`

### 5.2. Hướng dẫn tải và mở Artifacts từ GitHub
1. Cuộn xuống phần **Artifacts** ở chân trang chi tiết của lần chạy.
2. Bấm tải gói `allure-report.zip` hoặc `playwright-report.zip`.
3. Giải nén và mở file `index.html` để chứng minh báo cáo được lưu trữ vĩnh viễn trên Cloud.

---

## 💡 6. Bộ câu hỏi vấn đáp Giảng viên thường hỏi và gợi ý trả lời

### Q1: Tại sao nhóm lại sử dụng song song cả Playwright HTML Report và Allure Report?
> **Trả lời:** *Playwright HTML Report rất mạnh về việc debug cục bộ nhờ tích hợp sẵn Screenshot, Video và Trace Viewer cho phép xem lại từng mili-giây hành động. Trong khi đó, Allure Report là chuẩn công nghiệp trong các dự án lớn, cung cấp biểu đồ thống kê xu hướng (Trends), phân loại mức độ nghiêm trọng (Severity), ánh xạ theo User Story (Behaviors) và hỗ trợ tích hợp với Jira/CI/CD rất trực quan cho các bên liên quan (Stakeholders/Managers).*

### Q2: Vì sao Allure Report yêu cầu phải có Java JDK trong file workflow GitHub Actions?
> **Trả lời:** *Gói `allure-commandline` bản chất là một công cụ đóng gói bằng Java thực hiện phân tích cú pháp các file kết quả JSON trong thư mục `allure-results` để tạo ra trang tĩnh HTML. Vì vậy, trên Runner Ubuntu của GitHub Actions bắt buộc phải cài đặt Java (nhóm sử dụng `actions/setup-java@v4` bản Temurin 17) để lệnh `npm run allure:generate` biên dịch thành công.*

### Q3: Khi chạy test song song nhiều luồng (parallel), dữ liệu trong localStorage có bị xung đột không?
> **Trả lời:** *Website sử dụng `localStorage` trên trình duyệt để lưu phiên và danh sách bài tập. Nếu chạy song song nhiều worker trên cùng một context thì dữ liệu có thể đè lên nhau. Do đó trong file `playwright.config.js`, nhóm đã cấu hình `workers: 1` và `fullyParallel: false`, đồng thời trong mỗi file test đều có hook `beforeEach` thực hiện `localStorage.clear()` và `page.reload()` để đảm bảo tính độc lập tuyệt đối giữa từng test case.*

### Q4: Kịch bản demo bắt lỗi có làm hỏng mã nguồn hoặc bẩn lịch sử Git không?
> **Trả lời:** *Dạ hoàn toàn không. Nhóm thiết kế file test riêng biệt `tests/demo_failure_report.spec.js` sử dụng điều kiện `test.skip(process.env.RUN_DEMO_FAIL !== 'true')`. Khi chạy thông thường, test này luôn bị bỏ qua. Chỉ khi gọi script `demo-failure.js`, biến môi trường mới được truyền vào. Do đó mã nguồn gốc và mã nguồn kiểm thử không hề bị sửa đổi, bảo đảm an toàn 100%.*
