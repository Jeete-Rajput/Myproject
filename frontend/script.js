// =============================================
// Modern Library Management System
// =============================================

// Global State
let currentUser = null;
let currentRole = null;
let registeredStudents = JSON.parse(localStorage.getItem('registeredStudents')) || [];

// Sample Data
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', genre: 'Fiction', year: 1925, status: 'available' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', genre: 'Fiction', year: 1960, status: 'borrowed' },
    { id: 3, title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', genre: 'Dystopian', year: 1949, status: 'available' },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', genre: 'Romance', year: 1813, status: 'available' },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-316-76948-0', genre: 'Fiction', year: 1951, status: 'borrowed' }
];

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St', membershipId: 'LIB001' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', address: '456 Oak Ave', membershipId: 'LIB002' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '555-123-4567', address: '789 Pine St', membershipId: 'LIB003' }
];

let transactions = [
    { id: 1, bookId: 2, userId: 1, borrowDate: '2024-01-01', dueDate: '2024-01-15', returnDate: null, status: 'active' },
    { id: 2, bookId: 5, userId: 2, borrowDate: '2024-01-05', dueDate: '2024-01-19', returnDate: null, status: 'active' }
];

let activities = [
    { id: 1, type: 'borrow', message: 'John Doe borrowed "To Kill a Mockingbird"', time: '2 hours ago' },
    { id: 2, type: 'return', message: 'Jane Smith returned "The Great Gatsby"', time: '1 day ago' },
    { id: 3, type: 'add', message: 'New book "1984" added to library', time: '2 days ago' }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 2000);
    loadRegisteredStudents();
});

// ===== AUTHENTICATION FUNCTIONS =====

function setRole(role) {
    currentRole = role;
    document.getElementById('roleSelection').style.display = 'none';
    
    if (role === 'admin') {
        document.querySelector('.admin-role').classList.add('active');
        document.querySelector('.student-role').classList.remove('active');
        document.getElementById('loginTitle').textContent = 'Admin Login';
        document.getElementById('demoCredentials').style.display = 'block';
        document.getElementById('studentAuthLinks').style.display = 'none';
        document.querySelector('.auth-card').style.borderLeftColor = '#3b82f6';
    } else {
        document.querySelector('.student-role').classList.add('active');
        document.querySelector('.admin-role').classList.remove('active');
        document.getElementById('loginTitle').textContent = 'Student Login';
        document.getElementById('demoCredentials').style.display = 'none';
        document.getElementById('studentAuthLinks').style.display = 'block';
        document.querySelector('.auth-card').style.borderLeftColor = '#8b5cf6';
    }
    
    document.getElementById('loginView').style.display = 'block';
}

function backToRole() {
    currentRole = null;
    document.getElementById('roleSelection').style.display = 'block';
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('signupView').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.querySelector('.admin-role').classList.remove('active');
    document.querySelector('.student-role').classList.remove('active');
}

function toStudentLogin() {
    document.getElementById('signupView').style.display = 'none';
    document.getElementById('loginView').style.display = 'block';
    clearSignupForm();
}

function toStudentSignup() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('signupView').style.display = 'block';
    clearSignupForm();
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    if (currentRole === 'admin') {
        if (username === 'admin' && password === 'admin123') {
            currentUser = { username: 'admin', role: 'admin', name: 'Admin User' };
            showApp();
            showSuccess('Admin logged in successfully!');
        } else {
            showError('Invalid admin credentials');
        }
    } else if (currentRole === 'student') {
        const student = registeredStudents.find(s => s.username === username && s.password === password);
        if (student) {
            currentUser = { username: student.username, role: 'student', name: student.name };
            showApp();
            showSuccess(`Welcome ${student.name}!`);
        } else {
            showError('Invalid credentials. Please check your username and password.');
        }
    }
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!name || !username || !email || !phone || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (registeredStudents.find(s => s.username === username)) {
        showError('Username already exists');
        return;
    }
    
    const newStudent = { id: Date.now(), name, username, email, phone, password };
    registeredStudents.push(newStudent);
    localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));
    
    showSuccess('Account created successfully! You can now login.');
    clearSignupForm();
    toStudentLogin();
}

function clearSignupForm() {
    document.getElementById('signupName').value = '';
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPhone').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
}

function loadRegisteredStudents() {
    registeredStudents = JSON.parse(localStorage.getItem('registeredStudents')) || [];
}

// ===== APP DISPLAY FUNCTIONS =====

function showApp() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('appSection').style.display = 'block';
    updateUserDisplay();
    updateDashboard();
    setupNavigation();
}

function logout() {
    currentUser = null;
    currentRole = null;
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('appSection').style.display = 'none';
    backToRole();
    showSuccess('Logged out successfully');
}

function updateUserDisplay() {
    document.getElementById('userDisplay').textContent = currentUser.name || 'User';
    
    if (currentRole === 'admin') {
        document.getElementById('booksNav').style.display = 'block';
        document.getElementById('usersNav').style.display = 'block';
    } else {
        document.getElementById('booksNav').style.display = 'none';
        document.getElementById('usersNav').style.display = 'none';
    }
}

function setupNavigation() {
    showSection('dashboard');
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Update navbar active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Load section data
    if (sectionId === 'dashboard') {
        updateDashboard();
    } else if (sectionId === 'books') {
        renderBooks();
    } else if (sectionId === 'users') {
        renderUsers();
    } else if (sectionId === 'transactions') {
        renderTransactions();
    }
}

// ===== DASHBOARD =====

function updateDashboard() {
    document.getElementById('totalBooks').textContent = books.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('borrowedBooks').textContent = transactions.filter(t => t.status === 'active').length;
    document.getElementById('dueToday').textContent = transactions.filter(t => new Date(t.dueDate) <= new Date()).length;
    
    renderActivities();
}

function renderActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <p>${activity.message}</p>
            <small class="activity-time">${activity.time}</small>
        `;
        activityList.appendChild(item);
    });
}

// ===== BOOKS MANAGEMENT =====

function renderBooks() {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';
    
    books.forEach(book => {
        const statusBadge = `<span class="badge ${book.status === 'available' ? 'available' : 'borrowed'}">${book.status}</span>`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.genre}</td>
            <td>${book.year}</td>
            <td>${statusBadge}</td>
            <td>
                ${currentRole === 'admin' ? `
                    <button class="btn btn-sm btn-edit" onclick="editBookModal(${book.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-delete" onclick="deleteBook(${book.id})"><i class="fas fa-trash"></i></button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddBookModal() {
    const modal = new bootstrap.Modal(document.getElementById('addBookModal'));
    document.getElementById('addBookForm').reset();
    modal.show();
}

function addBook() {
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const isbn = document.getElementById('bookISBN').value.trim();
    const genre = document.getElementById('bookGenre').value.trim();
    const year = document.getElementById('bookYear').value;
    
    if (!title || !author || !isbn || !genre || !year) {
        showError('Please fill in all fields');
        return;
    }
    
    const newBook = {
        id: Math.max(...books.map(b => b.id), 0) + 1,
        title, author, isbn, genre, year: parseInt(year),
        status: 'available'
    };
    
    books.push(newBook);
    renderBooks();
    updateDashboard();
    
    bootstrap.Modal.getInstance(document.getElementById('addBookModal')).hide();
    showSuccess('Book added successfully!');
}

function deleteBook(bookId) {
    if (confirm('Are you sure?')) {
        books = books.filter(b => b.id !== bookId);
        renderBooks();
        updateDashboard();
        showSuccess('Book deleted successfully!');
    }
}

function searchBooks() {
    const query = document.getElementById('bookSearch').value.toLowerCase();
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';
    
    const filtered = books.filter(b => 
        b.title.toLowerCase().includes(query) || 
        b.author.toLowerCase().includes(query) ||
        b.genre.toLowerCase().includes(query)
    );
    
    filtered.forEach(book => {
        const statusBadge = `<span class="badge ${book.status === 'available' ? 'available' : 'borrowed'}">${book.status}</span>`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.genre}</td>
            <td>${book.year}</td>
            <td>${statusBadge}</td>
            <td>${currentRole === 'admin' ? `
                <button class="btn btn-sm btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-delete" onclick="deleteBook(${book.id})"><i class="fas fa-trash"></i></button>
            ` : ''}</td>
        `;
        tbody.appendChild(row);
    });
}

// ===== USERS MANAGEMENT =====

function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.membershipId}</td>
            <td>
                <button class="btn btn-sm btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-delete" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    document.getElementById('addUserForm').reset();
    modal.show();
}

function addUser() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const address = document.getElementById('userAddress').value.trim();
    
    if (!name || !email || !phone || !address) {
        showError('Please fill in all fields');
        return;
    }
    
    const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        name, email, phone, address,
        membershipId: `LIB${String(users.length + 1).padStart(3, '0')}`
    };
    
    users.push(newUser);
    renderUsers();
    updateDashboard();
    
    bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
    showSuccess('User added successfully!');
}

function deleteUser(userId) {
    if (confirm('Are you sure?')) {
        users = users.filter(u => u.id !== userId);
        renderUsers();
        updateDashboard();
        showSuccess('User deleted successfully!');
    }
}

function searchUsers() {
    const query = document.getElementById('userSearch').value.toLowerCase();
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    const filtered = users.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
    );
    
    filtered.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.membershipId}</td>
            <td>
                <button class="btn btn-sm btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-delete" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ===== TRANSACTIONS =====

function renderTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';
    
    transactions.forEach(trans => {
        const book = books.find(b => b.id === trans.bookId);
        const user = users.find(u => u.id === trans.userId);
        const statusBadge = `<span class="badge ${trans.status === 'active' ? 'active' : 'overdue'}">${trans.status}</span>`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book ? book.title : 'N/A'}</td>
            <td>${user ? user.name : 'N/A'}</td>
            <td>${trans.borrowDate}</td>
            <td>${trans.dueDate}</td>
            <td>${statusBadge}</td>
            <td>
                ${trans.status === 'active' ? `
                    <button class="btn btn-sm btn-warning" onclick="showReturnBook(${trans.id})"><i class="fas fa-undo"></i></button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    populateBorrowDropdowns();
}

function showBorrowModal() {
    const modal = new bootstrap.Modal(document.getElementById('borrowModal'));
    document.getElementById('borrowForm').reset();
    modal.show();
}

function showReturnModal() {
    const modal = new bootstrap.Modal(document.getElementById('returnModal'));
    document.getElementById('returnForm').reset();
    modal.show();
}

function populateBorrowDropdowns() {
    // Populate borrow user dropdown
    const borrowUserSelect = document.getElementById('borrowUser');
    borrowUserSelect.innerHTML = '<option value="">Select User</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        borrowUserSelect.appendChild(option);
    });
    
    // Populate borrow book dropdown
    const borrowBookSelect = document.getElementById('borrowBook');
    borrowBookSelect.innerHTML = '<option value="">Select Book</option>';
    books.filter(b => b.status === 'available').forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = book.title;
        borrowBookSelect.appendChild(option);
    });
    
    // Populate return transaction dropdown
    const returnTransSelect = document.getElementById('returnTransaction');
    returnTransSelect.innerHTML = '<option value="">Select Transaction</option>';
    transactions.filter(t => t.status === 'active').forEach(trans => {
        const book = books.find(b => b.id === trans.bookId);
        const user = users.find(u => u.id === trans.userId);
        const option = document.createElement('option');
        option.value = trans.id;
        option.textContent = `${book ? book.title : 'N/A'} - ${user ? user.name : 'N/A'}`;
        returnTransSelect.appendChild(option);
    });
}

function borrowBook() {
    const userId = parseInt(document.getElementById('borrowUser').value);
    const bookId = parseInt(document.getElementById('borrowBook').value);
    const dueDate = document.getElementById('dueDate').value;
    
    if (!userId || !bookId || !dueDate) {
        showError('Please fill in all fields');
        return;
    }
    
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.status = 'borrowed';
    }
    
    const newTrans = {
        id: Math.max(...transactions.map(t => t.id), 0) + 1,
        bookId, userId,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate, returnDate: null,
        status: 'active'
    };
    
    transactions.push(newTrans);
    renderTransactions();
    updateDashboard();
    
    bootstrap.Modal.getInstance(document.getElementById('borrowModal')).hide();
    showSuccess('Book borrowed successfully!');
}

function returnBook() {
    const transId = parseInt(document.getElementById('returnTransaction').value);
    const returnDate = document.getElementById('returnDate').value;
    
    if (!transId || !returnDate) {
        showError('Please fill in all fields');
        return;
    }
    
    const trans = transactions.find(t => t.id === transId);
    if (trans) {
        trans.returnDate = returnDate;
        trans.status = 'returned';
        
        const book = books.find(b => b.id === trans.bookId);
        if (book) {
            book.status = 'available';
        }
    }
    
    renderTransactions();
    updateDashboard();
    
    bootstrap.Modal.getInstance(document.getElementById('returnModal')).hide();
    showSuccess('Book returned successfully!');
}

function showReturnBook(transId) {
    const trans = transactions.find(t => t.id === transId);
    if (trans) {
        document.getElementById('returnTransaction').value = transId;
    }
    const modal = new bootstrap.Modal(document.getElementById('returnModal'));
    modal.show();
}

// ===== TOAST NOTIFICATIONS =====

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showToast(message, type) {
    if (type === 'success') {
        document.getElementById('successToastMsg').textContent = message;
        const toast = new bootstrap.Toast(document.getElementById('successToast'));
        toast.show();
    } else {
        document.getElementById('errorToastMsg').textContent = message;
        const toast = new bootstrap.Toast(document.getElementById('errorToast'));
        toast.show();
    }
}
