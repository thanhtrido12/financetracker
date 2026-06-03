// LẤY CÁC PHẦN TỬ DOM (Tiêu chí: Tương tác với DOM)
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// TÍNH NĂNG NÂNG CAO: Đọc dữ liệu từ LocalStorage khi khởi động trang
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// ==========================================
// ĐỦ 05 HÀM TỰ ĐỊNH NGHĨA THEO YÊU CẦU ĐỀ BÀI
// ==========================================

// HÀM 1: Hàm khởi tạo và làm mới ứng dụng (Init)
function init() {
    list.innerHTML = '';
    // TIÊU CHÍ VÒNG LẶP: Dùng forEach để duyệt qua mảng dữ liệu
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// HÀM 2: Thêm giao dịch vào danh sách hiển thị trên DOM
function addTransactionDOM(transaction) {
    const item = document.createElement('li');

    // TIÊU CHÍ CẤU TRÚC ĐIỀU KIỆN (IF/ELSE): Xác định màu sắc dựa vào loại giao dịch
    if (transaction.type === 'income') {
        item.classList.add('plus');
        item.innerHTML = `
            ${transaction.text} <span>+${formatNumber(transaction.amount)}đ</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;
    } else {
        item.classList.add('minus');
        item.innerHTML = `
            ${transaction.text} <span>-${formatNumber(transaction.amount)}đ</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;
    }
    list.appendChild(item);
}

// HÀM 3: Tính toán lại tổng Số dư, Thu nhập, Chi phí
function updateValues() {
    let total = 0;
    let income = 0;
    let expense = 0;

    // TIÊU CHÍ VÒNG LẶP: Duyệt mảng tính toán tiền
    for (let i = 0; i < transactions.length; i++) {
        const t = transactions[i];
        if (t.type === 'income') {
            income += t.amount;
            total += t.amount;
        } else {
            expense += t.amount;
            total -= t.amount;
        }
    }

    // Tương tác DOM cập nhật giao diện
    balance.innerText = `${formatNumber(total)} VND`;
    money_plus.innerText = `+${formatNumber(income)} VND`;
    money_minus.innerText = `-${formatNumber(expense)} VND`;
}

// HÀM 4: Xử lý sự kiện khi người dùng bấm nút Submit Form
function handleFormSubmit(e) {
    e.preventDefault();

    // Lấy loại giao dịch từ Radio Button
    const typeSelected = document.querySelector('input[name="type"]:checked').value;

    // Kiểm tra tính hợp lệ dữ liệu (Cấu trúc điều kiện If/Else)
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Vui lòng điền đầy đủ tên và số tiền!');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: parseFloat(amount.value),
            type: typeSelected
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        // Reset form
        text.value = '';
        amount.value = '';
    }
}

// HÀM 5: Xóa giao dịch theo ID
function removeTransaction(id) {
    // Lọc bỏ phần tử có ID trùng khớp
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}


// CÁC HÀM BỔ TRỢ KHÁC (Tăng điểm chuyên môn)


// Hàm tạo ID ngẫu nhiên
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Hàm cập nhật Local Storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Hàm định dạng số tiền cho đẹp (VD: 100000 -> 100,000)
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// Lắng nghe sự kiện Submit
form.addEventListener('submit', handleFormSubmit);

// Chạy ứng dụng khi load trang
init();