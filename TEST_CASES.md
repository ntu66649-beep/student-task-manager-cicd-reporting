# 📋 BẢNG ĐẶC TẢ CA KIỂM THỬ (TEST CASES SPECIFICATION)

**Dự án:** Student Task Manager – CI/CD & Reporting  
**Học phần:** SWT301 – Software Testing  
**Công cụ kiểm thử:** Playwright Test Framework  
**Tổng số ca kiểm thử:** 26 Test Cases (25 Automated Official Tests + 1 Controlled Failure Demo Test)

---

## 📑 1. Bảng tóm tắt danh mục Test Cases

| Mã Test Case | Tên ca kiểm thử | Module | Phân loại | Độ ưu tiên | Kết quả kỳ vọng |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_AUTH_01** | Đăng nhập thành công với tài khoản và mật khẩu đúng | Authentication | Positive | P1 | PASS |
| **TC_AUTH_02** | Báo lỗi khi để trống trường đăng nhập | Authentication | Negative / Validation | P1 | PASS |
| **TC_AUTH_03** | Báo lỗi khi nhập sai mật khẩu | Authentication | Negative / Validation | P1 | PASS |
| **TC_AUTH_04** | Báo lỗi khi tài khoản không tồn tại trong hệ thống | Authentication | Negative / Validation | P2 | PASS |
| **TC_AUTH_05** | Đăng xuất tài khoản và quay về màn hình Đăng nhập | Authentication | Positive | P1 | PASS |
| **TC_TASK_01** | Hiển thị danh sách nhiệm vụ và các thẻ thống kê ban đầu | Task CRUD | Positive | P1 | PASS |
| **TC_TASK_02** | Thêm mới nhiệm vụ thành công với dữ liệu hợp lệ | Task CRUD | Positive | P1 | PASS |
| **TC_TASK_03** | Báo lỗi khi thêm nhiệm vụ mà không nhập tiêu đề | Task CRUD | Negative / Validation | P1 | PASS |
| **TC_TASK_03B**| Báo lỗi khi chọn Deadline trong quá khứ và ngăn chặn lưu task | Task CRUD | Negative / Validation | P1 | PASS |
| **TC_TASK_03C**| Thêm nhiệm vụ thành công khi chọn Deadline là ngày hôm nay | Task CRUD | Positive / Boundary | P2 | PASS |
| **TC_TASK_04** | Đánh dấu hoàn thành nhiệm vụ (Mark Complete) | Task CRUD | Positive | P1 | PASS |
| **TC_TASK_05** | Chuyển đổi trạng thái từ hoàn thành trở lại Đang chờ | Task CRUD | Positive | P2 | PASS |
| **TC_TASK_06** | Xóa thành công một nhiệm vụ khỏi danh sách | Task CRUD | Positive | P1 | PASS |
| **TC_TASK_07** | Lọc danh sách nhiệm vụ theo trạng thái (Tất cả / Đang chờ / Hoàn thành) | Task Filter | Positive | P2 | PASS |
| **TC_TASK_08** | Tìm kiếm theo từ khóa và hiển thị Empty State khi không có kết quả | Task Search | Positive / Boundary | P2 | PASS |
| **TC_ADMIN_01**| Đăng nhập tài khoản Admin thành công và chuyển hướng đến Admin Dashboard | Admin Module | Positive | P1 | PASS |
| **TC_ADMIN_02**| Thống kê số lượng sinh viên và bài tập toàn hệ thống chính xác | Admin Module | Positive | P1 | PASS |
| **TC_ADMIN_03**| Hiển thị danh sách sinh viên kèm tiến độ hoàn thành | Admin Module | Positive | P1 | PASS |
| **TC_ADMIN_04**| Chọn từng sinh viên để xem chi tiết danh sách nhiệm vụ của sinh viên đó | Admin Module | Positive | P1 | PASS |
| **TC_ADMIN_05**| Lọc danh sách bài tập của sinh viên theo trạng thái | Admin Module | Positive | P2 | PASS |
| **TC_ADMIN_06**| Phân quyền: Tài khoản Student đăng nhập không hiển thị Admin Dashboard | Role Separation | Security / Boundary | P1 | PASS |
| **TC_ADMIN_07**| Đăng xuất khỏi Admin Dashboard quay về màn hình Đăng nhập | Admin Module | Positive | P1 | PASS |
| **TC_PERSIST_01**| Duy trì phiên đăng nhập và dữ liệu nhiệm vụ sau khi F5 trang | Data Persistence | Reliability | P1 | PASS |
| **TC_DEMO_FAIL**| Cố ý so khớp sai để chứng minh khả năng phát hiện lỗi của Playwright | Demo Failure | Controlled Failure | P3 | FAILED (Cố ý) |

---

## 🔍 2. Chi tiết đặc tả từng Test Case

### Module 1: Xác thực & Phân quyền (Authentication: Login & Logout)

#### TC_AUTH_01: Đăng nhập thành công với tài khoản và mật khẩu đúng
- **File thực thi:** `tests/auth.spec.js`
- **Mục tiêu:** Xác minh người dùng sinh viên có thể đăng nhập thành công với tài khoản hợp lệ.
- **Tiền điều kiện:** Ứng dụng đang ở màn hình Đăng nhập (`auth-view`). `localStorage` trống.
- **Dữ liệu kiểm thử:** Username = `student1`, Password = `123456`.
- **Các bước thực hiện:**
  1. Điều hướng đến trang chủ `/`.
  2. Nhập `student1` vào ô Tên đăng nhập.
  3. Nhập `123456` vào ô Mật khẩu.
  4. Nhấn nút "Đăng nhập".
- **Kết quả mong đợi:**
  - Màn hình Đăng nhập bị ẩn (`auth-view` is hidden).
  - Màn hình Dashboard sinh viên hiển thị (`dashboard-view` is visible).
  - Lời chào hiển thị: "Nguyễn Văn Tuấn".
  - Thông báo Toast hiển thị: "Chào mừng Nguyễn Văn Tuấn quay trở lại!".

#### TC_AUTH_02: Báo lỗi khi để trống trường đăng nhập
- **File thực thi:** `tests/auth.spec.js`
- **Mục tiêu:** Xác minh hệ thống kiểm tra tính hợp lệ và chặn đăng nhập khi người dùng bỏ trống form.
- **Tiền điều kiện:** Ứng dụng ở màn hình Đăng nhập.
- **Dữ liệu kiểm thử:** Username = `""`, Password = `""`.
- **Các bước thực hiện:**
  1. Để trống cả 2 ô Tên đăng nhập và Mật khẩu.
  2. Nhấn nút "Đăng nhập".
- **Kết quả mong đợi:**
  - Vẫn ở lại màn hình Đăng nhập, không vào Dashboard.
  - Khối thông báo lỗi `auth-error` hiển thị với nội dung: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!".

#### TC_AUTH_03: Báo lỗi khi nhập sai mật khẩu
- **File thực thi:** `tests/auth.spec.js`
- **Mục tiêu:** Xác minh hệ thống từ chối đăng nhập khi người dùng nhập sai mật khẩu.
- **Dữ liệu kiểm thử:** Username = `student1`, Password = `sai_mat_khau_123`.
- **Các bước thực hiện:**
  1. Nhập username đúng: `student1`.
  2. Nhập mật khẩu sai: `sai_mat_khau_123`.
  3. Nhấn nút "Đăng nhập".
- **Kết quả mong đợi:**
  - Thông báo lỗi `auth-error` hiển thị: "Tên đăng nhập hoặc mật khẩu không chính xác!".
  - Dashboard không hiển thị.

#### TC_AUTH_04: Báo lỗi khi tài khoản không tồn tại trong hệ thống
- **File thực thi:** `tests/auth.spec.js`
- **Mục tiêu:** Xác minh hệ thống chặn đăng nhập với người dùng chưa đăng ký.
- **Dữ liệu kiểm thử:** Username = `user_khong_ton_tai`, Password = `123456`.
- **Các bước thực hiện:**
  1. Nhập username không tồn tại.
  2. Nhập mật khẩu bất kỳ.
  3. Nhấn nút "Đăng nhập".
- **Kết quả mong đợi:**
  - Hiển thị thông báo lỗi "Tên đăng nhập hoặc mật khẩu không chính xác!".
  - Dashboard vẫn bị ẩn.

#### TC_AUTH_05: Đăng xuất tài khoản và quay về màn hình Đăng nhập
- **File thực thi:** `tests/auth.spec.js`
- **Mục tiêu:** Xác minh chức năng Đăng xuất xóa phiên làm việc và bảo vệ ứng dụng.
- **Tiền điều kiện:** Đã đăng nhập tài khoản `student1`.
- **Các bước thực hiện:**
  1. Đăng nhập thành công vào Dashboard.
  2. Nhấn nút "Đăng xuất" (`btn-logout`) trên thanh tiêu đề.
- **Kết quả mong đợi:**
  - Màn hình Dashboard bị ẩn.
  - Quay trở lại màn hình Đăng nhập `auth-view`.
  - Thông báo Toast hiển thị: "Đã đăng xuất thành công!".

---

### Module 2: Quản lý Nhiệm vụ Học tập (Task CRUD, Filters & Search)

#### TC_TASK_01: Hiển thị danh sách nhiệm vụ và các thẻ thống kê ban đầu
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Xác minh dữ liệu mẫu ban đầu được tải chính xác cho sinh viên.
- **Tiền điều kiện:** Đã đăng nhập tài khoản `student1`.
- **Các bước thực hiện:**
  1. Quan sát danh sách bài tập tại màn hình chính.
  2. Kiểm tra các ô thống kê (Tổng số, Đang chờ, Đã hoàn thành).
- **Kết quả mong đợi:**
  - Danh sách hiển thị đúng 3 bài tập mẫu.
  - Thẻ `stat-total` = "3", `stat-pending` = "2", `stat-completed` = "1".
  - Tiêu đề bài tập đầu tiên: "Nộp báo cáo giữa kỳ môn Kiểm thử phần mềm".

#### TC_TASK_02: Thêm mới nhiệm vụ thành công với dữ liệu hợp lệ
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Xác minh người dùng có thể tạo một nhiệm vụ mới với đầy đủ thông tin.
- **Dữ liệu kiểm thử:**
  - Tiêu đề: "Làm slide thuyết trình E2E Testing với Playwright"
  - Môn học: "Kiểm thử phần mềm"
  - Độ ưu tiên: "high" (Cao)
  - Hạn nộp: Ngày hiện tại + 7 ngày
  - Ghi chú: "Chuẩn bị kịch bản demo và slide báo cáo cho giảng viên"
- **Các bước thực hiện:**
  1. Điền toàn bộ dữ liệu vào Form thêm bài tập.
  2. Nhấn nút "Lưu nhiệm vụ" (`btn-add-task`).
- **Kết quả mong đợi:**
  - Toast thông báo: "Thêm nhiệm vụ mới thành công!".
  - Bài tập mới xuất hiện ở vị trí đầu tiên trong danh sách.
  - Tổng số lượng tăng lên 4, số bài đang chờ tăng lên 3.

#### TC_TASK_03: Báo lỗi khi thêm nhiệm vụ mà không nhập tiêu đề
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Xác minh form validation bắt buộc phải có tiêu đề nhiệm vụ.
- **Dữ liệu kiểm thử:** Tiêu đề = `""`, Môn học = "Lập trình Web".
- **Các bước thực hiện:**
  1. Bỏ trống ô Tên nhiệm vụ.
  2. Nhấn nút "Lưu nhiệm vụ".
- **Kết quả mong đợi:**
  - Thông báo lỗi form hiển thị: "Vui lòng nhập tên nhiệm vụ!".
  - Không có nhiệm vụ mới nào được tạo (tổng số vẫn là 3).

#### TC_TASK_03B: Báo lỗi khi chọn Deadline trong quá khứ và ngăn chặn lưu task
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Ràng buộc nghiệp vụ: Hạn nộp bài tập phải từ ngày hôm nay trở đi.
- **Dữ liệu kiểm thử:** Tiêu đề = "Nhiệm vụ có deadline quá khứ", Deadline = "2020-01-01".
- **Các bước thực hiện:**
  1. Nhập tiêu đề hợp lệ.
  2. Nhập hạn nộp là ngày cũ trong quá khứ ("2020-01-01").
  3. Nhấn "Lưu nhiệm vụ".
- **Kết quả mong đợi:**
  - Thông báo lỗi form hiển thị rõ: "Hạn nộp không được ở trong quá khứ!".
  - Danh sách bài tập không đổi (vẫn 3 bài).

#### TC_TASK_03C: Thêm nhiệm vụ thành công khi chọn Deadline là ngày hôm nay
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Kiểm tra giá trị biên (Boundary Value): Deadline đúng vào ngày hiện tại là hợp lệ.
- **Dữ liệu kiểm thử:** Tiêu đề = "Nhiệm vụ cần nộp gấp trong ngày hôm nay", Deadline = Ngày hôm nay.
- **Các bước thực hiện:**
  1. Nhập tiêu đề và chọn hạn nộp là ngày hôm nay.
  2. Nhấn "Lưu nhiệm vụ".
- **Kết quả mong đợi:**
  - Thêm bài tập thành công, Toast thông báo thành công.
  - Bài tập hiển thị với đúng hạn nộp là ngày hôm nay, tổng số tăng lên 4.

#### TC_TASK_04: Đánh dấu hoàn thành nhiệm vụ (Mark Complete)
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Chuyển đổi trạng thái bài tập từ Đang chờ sang Đã hoàn thành.
- **Các bước thực hiện:**
  1. Chọn bài tập đầu tiên (đang ở trạng thái Đang chờ).
  2. Nhấn nút checkbox/toggle hoàn thành.
- **Kết quả mong đợi:**
  - Trạng thái chuyển thành "Đã hoàn thành", thẻ bài tập có class `completed`.
  - Toast thông báo: "Đã hoàn thành nhiệm vụ!".
  - Thống kê: `stat-completed` tăng từ 1 lên 2, `stat-pending` giảm từ 2 xuống 1.

#### TC_TASK_05: Chuyển đổi trạng thái từ hoàn thành trở lại Đang chờ
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Cho phép sinh viên mở lại bài tập đã hoàn thành nếu cần làm lại.
- **Các bước thực hiện:**
  1. Chọn bài tập thứ 2 (đang ở trạng thái Đã hoàn thành).
  2. Nhấn nút toggle bỏ chọn hoàn thành.
- **Kết quả mong đợi:**
  - Trạng thái chuyển về "Đang chờ", bỏ class `completed`.
  - Toast thông báo: "Đã chuyển nhiệm vụ về Đang chờ!".
  - Thống kê: Hoàn thành giảm từ 1 xuống 0, Đang chờ tăng từ 2 lên 3.

#### TC_TASK_06: Xóa thành công một nhiệm vụ khỏi danh sách
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Xác minh chức năng xóa bài tập khỏi hệ thống.
- **Các bước thực hiện:**
  1. Lấy tên bài tập đầu tiên.
  2. Nhấn nút Xóa (biểu tượng thùng rác).
- **Kết quả mong đợi:**
  - Toast thông báo: `Đã xóa nhiệm vụ "..."!`.
  - Số lượng bài tập giảm từ 3 xuống 2.
  - Bài tập đã xóa biến mất hoàn toàn khỏi giao diện.

#### TC_TASK_07: Lọc danh sách nhiệm vụ theo trạng thái
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Xác minh bộ lọc trạng thái (Tất cả / Đang chờ / Đã hoàn thành).
- **Các bước thực hiện:**
  1. Chọn lọc "Đã hoàn thành" -> Kiểm tra hiển thị đúng 1 bài tập hoàn thành.
  2. Chọn lọc "Đang chờ" -> Kiểm tra hiển thị đúng 2 bài tập đang chờ.
  3. Chọn lọc "Tất cả" -> Kiểm tra hiển thị đủ cả 3 bài tập.
- **Kết quả mong đợi:** Danh sách bài tập hiển thị khớp chính xác theo từng tùy chọn lọc.

#### TC_TASK_09: Chỉnh sửa nhiệm vụ đã tạo
- **File thực thi:** `tests/tasks.spec.js`
- **Các bước:** Chọn Sửa trên một nhiệm vụ, cập nhật tiêu đề rồi lưu.
- **Kết quả mong đợi:** Nội dung mới hiển thị, số lượng nhiệm vụ không đổi.

#### TC_TASK_10: Tạo nhiệm vụ với môn học tùy chỉnh
- **File thực thi:** `tests/tasks.spec.js`
- **Các bước:** Chọn “Môn học khác”, nhập tên môn và lưu nhiệm vụ.
- **Kết quả mong đợi:** Tên môn tùy chỉnh hiển thị trên nhiệm vụ mới.

#### TC_TASK_08: Tìm kiếm theo từ khóa và hiển thị Empty State khi không có kết quả
- **File thực thi:** `tests/tasks.spec.js`
- **Mục tiêu:** Xác minh tìm kiếm thời gian thực và giao diện khi không tìm thấy kết quả.
- **Các bước thực hiện:**
  1. Gõ từ khóa "Lập trình" vào ô tìm kiếm -> Hiển thị đúng 1 bài tập.
  2. Gõ từ khóa ngẫu nhiên không tồn tại: "Từ khóa chắc chắn không có 123456".
  3. Xóa ô tìm kiếm về rỗng.
- **Kết quả mong đợi:**
  - Khi không khớp: 0 bài tập hiển thị, khối `empty-state` xuất hiện với thông báo "Không tìm thấy nhiệm vụ nào".
  - Khi xóa tìm kiếm: Khối `empty-state` biến mất, 3 bài tập ban đầu hiển thị lại đầy đủ.

---

### Module 3: Quản trị Hệ thống (Admin Dashboard & Role Separation)

#### TC_ADMIN_01: Đăng nhập tài khoản Admin thành công và chuyển hướng đến Admin Dashboard
- **File thực thi:** `tests/admin.spec.js`
- **Mục tiêu:** Xác minh tài khoản quản trị viên được chuyển đến đúng phân hệ Admin.
- **Dữ liệu kiểm thử:** Username = `admin`, Password = `admin123`.
- **Các bước thực hiện:**
  1. Nhập tài khoản và mật khẩu Admin.
  2. Nhấn "Đăng nhập".
- **Kết quả mong đợi:**
  - `admin-dashboard-view` hiển thị, `dashboard-view` (sinh viên) bị ẩn.
  - Lời chào Admin: "Giảng viên Hướng Dẫn (admin)".
  - Toast: "Chào mừng Quản trị viên Giảng viên Hướng Dẫn!".

#### TC_ADMIN_02: Thống kê số lượng sinh viên và bài tập toàn hệ thống chính xác
- **File thực thi:** `tests/admin.spec.js`
- **Mục tiêu:** Kiểm tra độ chính xác của các chỉ số tổng quan trên Admin Dashboard.
- **Các bước thực hiện:** Quan sát 4 thẻ số liệu trên Admin Dashboard.
- **Kết quả mong đợi:**
  - Tổng số sinh viên (`admin-stat-students`) = "2".
  - Tổng số nhiệm vụ toàn hệ thống (`admin-stat-total-tasks`) = "5" (student1 có 3 bài + student2 có 2 bài).
  - Nhiệm vụ đã hoàn thành (`admin-stat-completed-tasks`) = "2".
  - Nhiệm vụ đang chờ (`admin-stat-pending-tasks`) = "3".

#### TC_ADMIN_03: Hiển thị danh sách sinh viên kèm tiến độ hoàn thành
- **File thực thi:** `tests/admin.spec.js`
- **Mục tiêu:** Kiểm tra danh sách hiển thị các sinh viên trong lớp học.
- **Kết quả mong đợi:**
  - Hiển thị đúng 2 thẻ sinh viên.
  - Sinh viên 1: "Nguyễn Văn Tuấn" (`@student1`).
  - Sinh viên 2: "Trần Thị Mai" (`@student2`).

#### TC_ADMIN_04: Chọn từng sinh viên để xem chi tiết danh sách nhiệm vụ của sinh viên đó
- **File thực thi:** `tests/admin.spec.js`
- **Mục tiêu:** Admin có thể click vào bất kỳ sinh viên nào để xem danh sách bài tập riêng của người đó.
- **Các bước thực hiện:**
  1. Mặc định kiểm tra sinh viên 1 (Nguyễn Văn Tuấn) có 3 bài tập.
  2. Click vào thẻ sinh viên 2 (Trần Thị Mai).
- **Kết quả mong đợi:**
  - Tiêu đề chi tiết đổi thành "Trần Thị Mai".
  - Danh sách bài tập hiển thị đúng 2 bài tập của sinh viên 2 ("Thiết kế ERD" và "Lập trình API RESTful").

#### TC_ADMIN_05: Lọc danh sách bài tập của sinh viên theo trạng thái
- **File thực thi:** `tests/admin.spec.js`
- **Mục tiêu:** Admin có thể lọc các bài tập của sinh viên được chọn theo Đã hoàn thành hoặc Đang chờ.
- **Các bước thực hiện:**
  1. Chọn sinh viên 2.
  2. Lọc trạng thái: "completed" -> hiển thị 1 bài.
  3. Lọc trạng thái: "pending" -> hiển thị 1 bài.
  4. Lọc trạng thái: "all" -> hiển thị 2 bài.
- **Kết quả mong đợi:** Bộ lọc phản hồi tức thời, hiển thị đúng các bài tập tương ứng.

#### TC_ADMIN_06: Phân quyền: Tài khoản Student đăng nhập không hiển thị Admin Dashboard
- **File thực thi:** `tests/admin.spec.js`
- **Mục tiêu:** Xác minh tính an toàn và phân tách quyền: Sinh viên không được phép thấy hoặc truy cập Admin Dashboard.
- **Dữ liệu kiểm thử:** Username = `student1`, Password = `123456`.
- **Kết quả mong đợi:**
  - `dashboard-view` của sinh viên hiển thị.
  - `admin-dashboard-view` hoàn toàn bị ẩn (`isHidden`).

#### TC_ADMIN_07: Đăng xuất khỏi Admin Dashboard quay về màn hình Đăng nhập
- **File thực thi:** `tests/admin.spec.js`
- **Mục tiêu:** Quản trị viên đăng xuất an toàn.
- **Các bước thực hiện:**
  1. Tại màn hình Admin, nhấn nút "Đăng xuất" (`btn-admin-logout`).
- **Kết quả mong đợi:**
  - `admin-dashboard-view` bị ẩn.
  - Màn hình Đăng nhập `auth-view` xuất hiện trở lại.
  - Toast thông báo: "Đã đăng xuất thành công!".

---

### Module 4: Độ bền Dữ liệu (Data Persistence & Session Resilience)

#### TC_PERSIST_01: Duy trì phiên đăng nhập và dữ liệu nhiệm vụ sau khi F5 trang
- **File thực thi:** `tests/persistence.spec.js`
- **Mục tiêu:** Xác minh ứng dụng lưu trữ trạng thái vào `localStorage`, không bị mất phiên hoặc dữ liệu khi người dùng reload trang (F5).
- **Các bước thực hiện:**
  1. Đăng nhập với `student1`.
  2. Thêm một bài tập mới: "Nhiệm vụ kiểm tra F5 reload".
  3. Thực hiện tải lại trang web bằng lệnh `page.reload()`.
- **Kết quả mong đợi:**
  - Người dùng vẫn ở trong Dashboard sinh viên (không bị văng ra màn hình đăng nhập).
  - Lời chào vẫn là "Nguyễn Văn Tuấn".
  - Bài tập vừa thêm vẫn tồn tại nguyên vẹn trong danh sách (tổng 4 bài tập).

---

### Module 5: Trình diễn Phát hiện Lỗi có Kiểm soát (Controlled Failure Demo)

#### TC_DEMO_FAIL: Cố ý so khớp sai để chứng minh khả năng phát hiện lỗi của Playwright
- **File thực thi:** `tests/demo_failure_report.spec.js`
- **Mục tiêu:** Trình diễn thực tế cho Giảng viên xem cơ chế so sánh kỳ vọng (Expected vs Actual), cơ chế chụp ảnh lỗi và cập nhật Allure Report FAILED mà không làm hỏng mã nguồn dự án.
- **Cơ chế kích hoạt:**
  - Mặc định khi chạy `npm test`: Test case này tự động `test.skip()` để bảo toàn kết quả 100% Pass của bộ test chính.
  - Chỉ kích hoạt khi chạy lệnh chuyên dụng: `npm run demo:fail` (biến môi trường `RUN_DEMO_FAIL=true`).
- **Nội dung kiểm thử:** Nhập sai mật khẩu sinh viên, sau đó cố ý mong đợi Dashboard hiển thị (`expect(dashboard).toBeVisible()`).
- **Kết quả mong đợi khi Demo:**
  - Playwright báo lỗi: `Expected: visible, Received: hidden`.
  - Tự động xuất ảnh chụp lỗi tại `test-results/`.
  - Tự động ghi lại file video và vết trace `trace.zip`.
  - Allure Report cập nhật trạng thái FAILED màu đỏ với stack trace chi tiết.
- **Cách khôi phục:** Chỉ cần chạy lại `npm test`, hệ thống lập tức trở về trạng thái 23 PASSED mà không cần chỉnh sửa bất kỳ dòng mã nào.
