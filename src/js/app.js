// --- USER ACCOUNTS DATABASE (MOCK) ---
const USERS = [
  { username: 'student1', password: '123456', name: 'Nguyễn Văn Tuấn', role: 'student' },
  { username: 'student2', password: '123456', name: 'Trần Thị Mai', role: 'student' },
  { username: 'admin', password: 'admin123', name: 'Giảng viên Hướng Dẫn', role: 'admin' }
];

// Default sample tasks for student1
const DEFAULT_SAMPLE_TASKS = [
  {
    id: 'task_1',
    title: 'Nộp báo cáo giữa kỳ môn Kiểm thử phần mềm',
    subject: 'Kiểm thử phần mềm',
    priority: 'high',
    dueDate: '2026-10-25',
    desc: 'Hoàn thiện tài liệu test plan và kịch bản E2E Playwright',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_2',
    title: 'Làm bài thực hành Lập trình Web với Playwright',
    subject: 'Lập trình Web',
    priority: 'medium',
    dueDate: '2026-10-20',
    desc: 'Viết test script tự động cho form đăng nhập và quản lý công việc',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_3',
    title: 'Đọc slide chương 5 Cơ sở dữ liệu',
    subject: 'Cơ sở dữ liệu',
    priority: 'low',
    dueDate: '2026-10-30',
    desc: 'Tìm hiểu về Transaction và tối ưu hóa câu truy vấn SQL',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Default sample tasks for student2
const DEFAULT_STUDENT2_TASKS = [
  {
    id: 'task_s2_1',
    title: 'Thiết kế ERD và đặc tả bảng môn Cơ sở dữ liệu',
    subject: 'Cơ sở dữ liệu',
    priority: 'high',
    dueDate: '2026-10-22',
    desc: 'Vẽ sơ đồ quan hệ thực thể cho hệ thống quản lý thư viện',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_s2_2',
    title: 'Lập trình API RESTful bằng Node.js',
    subject: 'Lập trình Web',
    priority: 'medium',
    dueDate: '2026-10-26',
    desc: 'Xây dựng các router CRUD cho thực thể sinh viên',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Khởi tạo dữ liệu mẫu mô phỏng cho sinh viên nếu chưa có trong localStorage
function ensureMockDataForAdmin() {
  if (!localStorage.getItem('student_tasks_student1')) {
    localStorage.setItem('student_tasks_student1', JSON.stringify(DEFAULT_SAMPLE_TASKS));
  }
  if (!localStorage.getItem('student_tasks_student2')) {
    localStorage.setItem('student_tasks_student2', JSON.stringify(DEFAULT_STUDENT2_TASKS));
  }
}

// --- APP STATE ---
let currentUser = null;
let tasks = [];
let toastTimeout = null;

// --- DOM ELEMENTS ---
const authView = document.getElementById('auth-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authError = document.getElementById('auth-error');
const userGreeting = document.getElementById('user-greeting');
const logoutBtn = document.getElementById('logout-btn');

const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskSubjectSelect = document.getElementById('task-subject');
const taskDueDateInput = document.getElementById('task-due-date');
const taskPrioritySelect = document.getElementById('task-priority');
const taskDescInput = document.getElementById('task-desc');
const taskFormError = document.getElementById('task-form-error');
const customSubjectGroup = document.getElementById('custom-subject-group');
const customSubjectInput = document.getElementById('task-subject-custom');
const cancelEditBtn = document.getElementById('btn-cancel-edit');
let editingTaskId = null;

const searchInput = document.getElementById('search-input');
const filterStatusSelect = document.getElementById('filter-status');
const filterPrioritySelect = document.getElementById('filter-priority');
const taskListContainer = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCountBadge = document.getElementById('task-count-badge');

const statTotal = document.getElementById('stat-total');
const statPending = document.getElementById('stat-pending');
const statCompleted = document.getElementById('stat-completed');
const statHigh = document.getElementById('stat-high');
const toastEl = document.getElementById('toast');

// --- ADMIN DOM ELEMENTS ---
const adminDashboardView = document.getElementById('admin-dashboard-view');
const adminGreeting = document.getElementById('admin-greeting');
const adminLogoutBtn = document.getElementById('admin-logout-btn');
const adminStatStudents = document.getElementById('admin-stat-students');
const adminStatTotalTasks = document.getElementById('admin-stat-total-tasks');
const adminStatCompletedTasks = document.getElementById('admin-stat-completed-tasks');
const adminStatPendingTasks = document.getElementById('admin-stat-pending-tasks');
const adminStudentCountBadge = document.getElementById('admin-student-count-badge');
const adminStudentList = document.getElementById('admin-student-list');
const adminSelectedStudentName = document.getElementById('admin-selected-student-name');
const adminSelectedStudentMeta = document.getElementById('admin-selected-student-meta');
const adminStudentTaskBadge = document.getElementById('admin-student-task-badge');
const adminFilterStatus = document.getElementById('admin-filter-status');
const adminTaskList = document.getElementById('admin-task-list');
const adminEmptyTasks = document.getElementById('admin-empty-tasks');

let selectedStudentUsername = 'student1';

// --- HELPER FUNCTIONS ---
function showToast(message, type = 'success') {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.className = `toast toast-${type} show`;
  
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 'high': return 'Cao';
    case 'medium': return 'Trung bình';
    case 'low': return 'Thấp';
    default: return priority;
  }
}

function getTodayDateString() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}

function getDueDateState(task) {
  if (!task.dueDate || task.completed) return null;
  const daysLeft = Math.round((Date.parse(`${task.dueDate}T00:00:00Z`) - Date.parse(`${getTodayDateString()}T00:00:00Z`)) / 86400000);
  if (daysLeft < 0) return { label: `Quá hạn ${Math.abs(daysLeft)} ngày`, className: 'badge-due-overdue' };
  if (daysLeft === 0) return { label: 'Hạn hôm nay', className: 'badge-due-soon' };
  if (daysLeft <= 3) return { label: `Còn ${daysLeft} ngày`, className: 'badge-due-soon' };
  return null;
}

function initDueDateMin() {
  if (taskDueDateInput) {
    taskDueDateInput.min = getTodayDateString();
  }
}

// --- LOCAL STORAGE HELPERS ---
function getStorageKey(user) {
  return `student_tasks_${user.username}`;
}

function loadTasks() {
  if (!currentUser) return;
  const key = getStorageKey(currentUser);
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      tasks = Array.isArray(parsed) ? parsed.filter(task => task && typeof task.id === 'string' && typeof task.title === 'string') : [];
    } catch (e) {
      tasks = currentUser.username === 'student2' ? [...DEFAULT_STUDENT2_TASKS] : [...DEFAULT_SAMPLE_TASKS];
      saveTasks();
    }
  } else {
    // Initial tasks for newly logged in account
    const defaults = currentUser.username === 'student2' ? DEFAULT_STUDENT2_TASKS : DEFAULT_SAMPLE_TASKS;
    tasks = JSON.parse(JSON.stringify(defaults));
    saveTasks();
  }
}

function saveTasks() {
  if (!currentUser) return;
  const key = getStorageKey(currentUser);
  localStorage.setItem(key, JSON.stringify(tasks));
}

// --- RENDER FUNCTIONS ---
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  statTotal.textContent = total;
  statCompleted.textContent = completed;
  statPending.textContent = pending;
  statHigh.textContent = highPriority;
}

function renderTasks() {
  const query = (searchInput.value || '').trim().toLowerCase();
  const statusFilter = filterStatusSelect.value;
  const priorityFilter = filterPrioritySelect.value;

  const filteredTasks = tasks.filter(task => {
    // Search match (title or subject)
    const matchesSearch = 
      task.title.toLowerCase().includes(query) || 
      task.subject.toLowerCase().includes(query);

    // Status filter match
    let matchesStatus = true;
    if (statusFilter === 'pending') matchesStatus = !task.completed;
    if (statusFilter === 'completed') matchesStatus = task.completed;

    // Priority filter match
    let matchesPriority = true;
    if (priorityFilter !== 'all') matchesPriority = task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  taskCountBadge.textContent = `${filteredTasks.length} nhiệm vụ`;

  if (filteredTasks.length === 0) {
    taskListContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    taskListContainer.innerHTML = filteredTasks.map(task => {
      const isCompleted = task.completed;
      return `
        <article 
          class="task-item priority-${task.priority} ${isCompleted ? 'completed' : ''}" 
          data-testid="task-item" 
          data-task-id="${task.id}"
        >
          <div class="task-header-row">
            <div class="task-main-info">
              <button 
                type="button" 
                class="task-checkbox-btn" 
                data-testid="btn-toggle-task" 
                aria-label="${isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}"
                onclick="handleToggleTask('${task.id}')"
              >
                ${isCompleted ? '✓' : ''}
              </button>
              <div>
                <h4 class="task-title" data-testid="task-item-title">${escapeHtml(task.title)}</h4>
                ${task.desc ? `<p class="task-desc" data-testid="task-item-desc">${escapeHtml(task.desc)}</p>` : ''}
                
                <div class="task-badges">
                  <span class="badge badge-subject" data-testid="task-item-subject">📚 ${escapeHtml(task.subject)}</span>
                  <span class="badge badge-priority-${task.priority}" data-testid="task-item-priority">
                    ⚡ Ưu tiên: ${getPriorityLabel(task.priority)}
                  </span>
                  <span class="badge ${isCompleted ? 'badge-status-completed' : 'badge-status-pending'}" data-testid="task-item-status">
                    ${isCompleted ? '✅ Đã hoàn thành' : '⏳ Đang chờ'}
                  </span>
                  ${task.dueDate ? `<span class="task-date" data-testid="task-item-date">📅 Hạn: ${escapeHtml(task.dueDate)}</span>` : ''}
                  ${getDueDateState(task) ? `<span class="badge ${getDueDateState(task).className}" data-testid="task-due-state">${getDueDateState(task).label}</span>` : ''}
                </div>
              </div>
            </div>

            <div class="task-actions">
              <button type="button" class="btn-action-edit" data-testid="btn-edit-task" aria-label="Sửa nhiệm vụ" title="Sửa nhiệm vụ" onclick="handleEditTask('${task.id}')">✏️</button>
              <button 
                type="button" 
                class="btn-action-delete" 
                data-testid="btn-delete-task" 
                aria-label="Xóa nhiệm vụ"
                title="Xóa nhiệm vụ này"
                onclick="handleDeleteTask('${task.id}')"
              >
                🗑️
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  updateStats();
}

// --- AUTH HANDLERS ---
function switchView(viewName) {
  if (viewName === 'admin-dashboard') {
    authView.classList.add('hidden');
    dashboardView.classList.add('hidden');
    if (adminDashboardView) adminDashboardView.classList.remove('hidden');
  } else if (viewName === 'dashboard') {
    authView.classList.add('hidden');
    if (adminDashboardView) adminDashboardView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    initDueDateMin();
  } else {
    dashboardView.classList.add('hidden');
    if (adminDashboardView) adminDashboardView.classList.add('hidden');
    authView.classList.remove('hidden');
  }
}

function handleLogin(e) {
  e.preventDefault();
  authError.classList.add('hidden');
  authError.textContent = '';

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Validation: Empty inputs
  if (!username || !password) {
    authError.textContent = 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!';
    authError.classList.remove('hidden');
    return;
  }

  // Find user
  const foundUser = USERS.find(u => u.username === username && u.password === password);

  if (!foundUser) {
    authError.textContent = 'Tên đăng nhập hoặc mật khẩu không chính xác!';
    authError.classList.remove('hidden');
    return;
  }

  // Login successful
  currentUser = { username: foundUser.username, name: foundUser.name, role: foundUser.role };
  localStorage.setItem('student_current_user', JSON.stringify(currentUser));
  loginForm.reset();

  if (currentUser.role === 'admin') {
    ensureMockDataForAdmin();
    if (adminGreeting) adminGreeting.textContent = `Xin chào, ${currentUser.name}`;
    switchView('admin-dashboard');
    renderAdminDashboard();
    showToast(`Chào mừng Quản trị viên ${currentUser.name}!`, 'success');
  } else {
    userGreeting.textContent = `Xin chào, ${currentUser.name} (${currentUser.username})`;
    loadTasks();
    switchView('dashboard');
    renderTasks();
    showToast(`Chào mừng ${currentUser.name} đã đăng nhập!`, 'success');
  }
}

function handleLogout() {
  currentUser = null;
  tasks = [];
  localStorage.removeItem('student_current_user');
  switchView('auth');
  showToast('Đã đăng xuất thành công!', 'info');
}

// --- TASK ACTIONS ---
function handleAddTask(e) {
  e.preventDefault();
  taskFormError.classList.add('hidden');
  taskFormError.textContent = '';

  const title = taskTitleInput.value.trim();
  const subject = taskSubjectSelect.value === 'Khác' ? customSubjectInput.value.trim() : taskSubjectSelect.value;
  const priority = taskPrioritySelect.value;
  const dueDate = taskDueDateInput.value;
  const desc = taskDescInput.value.trim();

  // Validation: Title is required
  if (!title) {
    taskFormError.textContent = 'Vui lòng nhập tên nhiệm vụ!';
    taskFormError.classList.remove('hidden');
    taskTitleInput.focus();
    return;
  }

  if (taskSubjectSelect.value === 'Khác' && !subject) {
    taskFormError.textContent = 'Vui lòng nhập tên môn học!';
    taskFormError.classList.remove('hidden');
    customSubjectInput.focus();
    return;
  }

  // Validation: Deadline cannot be in the past
  if (dueDate) {
    const todayStr = getTodayDateString();
    if (dueDate < todayStr) {
      taskFormError.textContent = 'Hạn nộp không được ở trong quá khứ! Vui lòng chọn ngày hôm nay hoặc tương lai.';
      taskFormError.classList.remove('hidden');
      taskDueDateInput.focus();
      return;
    }
  }

  const newTask = {
    id: editingTaskId || 'task_' + Date.now(),
    title: title,
    subject: subject,
    priority: priority,
    dueDate: dueDate,
    desc: desc,
    completed: false,
    createdAt: editingTaskId ? (tasks.find(task => task.id === editingTaskId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
  };

  if (editingTaskId) {
    tasks = tasks.map(task => task.id === editingTaskId ? newTask : task);
    showToast('Cập nhật nhiệm vụ thành công!', 'success');
  } else {
    tasks.unshift(newTask);
    showToast('Thêm nhiệm vụ mới thành công!', 'success');
  }
  editingTaskId = null;
  saveTasks();
  taskForm.reset();
  customSubjectInput.disabled = true;
  customSubjectGroup.classList.add('hidden');
  cancelEditBtn.classList.add('hidden');
  document.getElementById('btn-add-task').textContent = 'Lưu nhiệm vụ';
  // Keep default priority to medium and reset min date
  taskPrioritySelect.value = 'medium';
  initDueDateMin();

  renderTasks();
}

window.handleEditTask = function(taskId) {
  const task = tasks.find(item => item.id === taskId);
  if (!task) return;
  editingTaskId = taskId;
  taskTitleInput.value = task.title;
  taskPrioritySelect.value = task.priority;
  taskDueDateInput.value = task.dueDate || '';
  taskDescInput.value = task.desc || '';
  const knownSubject = [...taskSubjectSelect.options].some(option => option.value === task.subject && option.value !== 'Khác');
  taskSubjectSelect.value = knownSubject ? task.subject : 'Khác';
  customSubjectInput.disabled = knownSubject;
  customSubjectGroup.classList.toggle('hidden', knownSubject);
  customSubjectInput.value = knownSubject ? '' : task.subject;
  cancelEditBtn.classList.remove('hidden');
  document.getElementById('btn-add-task').textContent = 'Cập nhật nhiệm vụ';
  taskTitleInput.focus();
};

function cancelTaskEdit() {
  editingTaskId = null;
  taskForm.reset();
  customSubjectInput.disabled = true;
  customSubjectGroup.classList.add('hidden');
  cancelEditBtn.classList.add('hidden');
  document.getElementById('btn-add-task').textContent = 'Lưu nhiệm vụ';
  taskPrioritySelect.value = 'medium';
}

window.handleToggleTask = function(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();

  const msg = task.completed ? 'Đã hoàn thành nhiệm vụ!' : 'Đã chuyển nhiệm vụ về Đang chờ!';
  showToast(msg, 'success');
};

window.handleDeleteTask = function(taskId) {
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return;

  const deletedTask = tasks.splice(index, 1)[0];
  saveTasks();
  renderTasks();
  showToast(`Đã xóa nhiệm vụ "${deletedTask.title}"!`, 'info');
};

// --- ADMIN FUNCTIONS ---
function getStudentsList() {
  return USERS.filter(u => u.role === 'student');
}

function getStudentTasksFromStorage(username) {
  const data = localStorage.getItem(`student_tasks_${username}`);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.filter(task => task && typeof task.id === 'string' && typeof task.title === 'string') : [];
    } catch (e) {
      return [];
    }
  }
  if (username === 'student1') return JSON.parse(JSON.stringify(DEFAULT_SAMPLE_TASKS));
  if (username === 'student2') return JSON.parse(JSON.stringify(DEFAULT_STUDENT2_TASKS));
  return [];
}

function renderAdminDashboard() {
  ensureMockDataForAdmin();
  const students = getStudentsList();

  let totalSystemTasks = 0;
  let totalCompletedTasks = 0;

  students.forEach(student => {
    const sTasks = getStudentTasksFromStorage(student.username);
    totalSystemTasks += sTasks.length;
    totalCompletedTasks += sTasks.filter(t => t.completed).length;
  });

  const totalPendingTasks = totalSystemTasks - totalCompletedTasks;

  if (adminStatStudents) adminStatStudents.textContent = students.length;
  if (adminStatTotalTasks) adminStatTotalTasks.textContent = totalSystemTasks;
  if (adminStatCompletedTasks) adminStatCompletedTasks.textContent = totalCompletedTasks;
  if (adminStatPendingTasks) adminStatPendingTasks.textContent = totalPendingTasks;
  if (adminStudentCountBadge) adminStudentCountBadge.textContent = `${students.length} sinh viên`;

  renderAdminStudentList(students);
  renderAdminSelectedStudentTasks();
}

function renderAdminStudentList(students) {
  if (!adminStudentList) return;

  adminStudentList.innerHTML = students.map(student => {
    const sTasks = getStudentTasksFromStorage(student.username);
    const total = sTasks.length;
    const completed = sTasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isActive = student.username === selectedStudentUsername;

    return `
      <div 
        class="admin-student-item ${isActive ? 'active' : ''}" 
        data-testid="admin-student-item"
        data-username="${student.username}"
        onclick="handleSelectAdminStudent('${student.username}')"
      >
        <div class="student-card-header">
          <div>
            <div class="student-name">${escapeHtml(student.name)}</div>
            <div class="student-username">@${escapeHtml(student.username)}</div>
          </div>
          <button 
            type="button" 
            class="btn btn-sm btn-primary"
            data-testid="btn-view-student-tasks"
            onclick="event.stopPropagation(); handleSelectAdminStudent('${student.username}')"
          >
            Xem bài tập
          </button>
        </div>

        <div class="student-stats-row">
          <span>Tiến độ: ${completed}/${total} bài tập</span>
          <strong>${percent}%</strong>
        </div>

        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

window.handleSelectAdminStudent = function(username) {
  selectedStudentUsername = username;
  renderAdminDashboard();
};

function renderAdminSelectedStudentTasks() {
  if (!adminTaskList) return;

  const student = USERS.find(u => u.username === selectedStudentUsername);
  if (!student) return;

  if (adminSelectedStudentName) adminSelectedStudentName.textContent = student.name;
  if (adminSelectedStudentMeta) adminSelectedStudentMeta.textContent = `Tài khoản: ${student.username}`;

  const allTasks = getStudentTasksFromStorage(student.username);
  const filterStatus = adminFilterStatus ? adminFilterStatus.value : 'all';

  const filteredTasks = allTasks.filter(task => {
    if (filterStatus === 'pending') return !task.completed;
    if (filterStatus === 'completed') return task.completed;
    return true;
  });

  if (adminStudentTaskBadge) {
    adminStudentTaskBadge.textContent = `${filteredTasks.length} nhiệm vụ`;
  }

  if (filteredTasks.length === 0) {
    adminTaskList.innerHTML = '';
    if (adminEmptyTasks) adminEmptyTasks.classList.remove('hidden');
  } else {
    if (adminEmptyTasks) adminEmptyTasks.classList.add('hidden');
    adminTaskList.innerHTML = filteredTasks.map(task => {
      const isCompleted = task.completed;
      return `
        <article 
          class="task-item priority-${task.priority} ${isCompleted ? 'completed' : ''}" 
          data-testid="admin-task-item"
        >
          <div class="task-header-row">
            <div class="task-main-info">
              <div>
                <h4 class="task-title" data-testid="admin-task-title">${escapeHtml(task.title)}</h4>
                ${task.desc ? `<p class="task-desc">${escapeHtml(task.desc)}</p>` : ''}
                
                <div class="task-badges">
                  <span class="badge badge-subject">📚 ${escapeHtml(task.subject)}</span>
                  <span class="badge badge-priority-${task.priority}">
                    ⚡ Ưu tiên: ${getPriorityLabel(task.priority)}
                  </span>
                  <span class="badge ${isCompleted ? 'badge-status-completed' : 'badge-status-pending'}" data-testid="admin-task-status">
                    ${isCompleted ? '✅ Đã hoàn thành' : '⏳ Đang chờ'}
                  </span>
                  ${task.dueDate ? `<span class="task-date">📅 Hạn: ${task.dueDate}</span>` : ''}
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
}

// --- EVENT LISTENERS ---
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', handleLogout);
taskForm.addEventListener('submit', handleAddTask);
cancelEditBtn.addEventListener('click', cancelTaskEdit);
taskSubjectSelect.addEventListener('change', () => {
  const custom = taskSubjectSelect.value === 'Khác';
  customSubjectInput.disabled = !custom;
  customSubjectGroup.classList.toggle('hidden', !custom);
  if (custom) customSubjectInput.focus();
});

searchInput.addEventListener('input', renderTasks);
filterStatusSelect.addEventListener('change', renderTasks);
filterPrioritySelect.addEventListener('change', renderTasks);
if (adminFilterStatus) adminFilterStatus.addEventListener('change', renderAdminSelectedStudentTasks);

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initDueDateMin();
  const savedUser = localStorage.getItem('student_current_user');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      if (currentUser.role === 'admin') {
        ensureMockDataForAdmin();
        if (adminGreeting) adminGreeting.textContent = `Xin chào, ${currentUser.name}`;
        switchView('admin-dashboard');
        renderAdminDashboard();
      } else {
        userGreeting.textContent = `Xin chào, ${currentUser.name} (${currentUser.username})`;
        loadTasks();
        switchView('dashboard');
        renderTasks();
      }
    } catch (e) {
      localStorage.removeItem('student_current_user');
      switchView('auth');
    }
  } else {
    switchView('auth');
  }
});
