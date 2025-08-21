// ===== CSRF =====
function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith("csrftoken=")) {
                cookieValue = cookie.substring("csrftoken=".length);
                break;
            }
        }
    }
    return cookieValue;
}

// ===== CONFIG =====
const API_URL = "/api/expenses/";   // relative -> same origin
let allExpenses = [];
let monthlyIncome = 0;

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    const savedIncome = localStorage.getItem("monthlyIncome");
    if (savedIncome) {
        monthlyIncome = parseFloat(savedIncome);
        document.getElementById("monthlyIncome").value = monthlyIncome;
    }
    fetchExpenses();
});

// ===== INCOME =====
document.getElementById("setIncomeBtn").addEventListener("click", () => {
    const value = parseFloat(document.getElementById("monthlyIncome").value);
    if (isNaN(value) || value <= 0) {
        alert("Please enter a valid monthly income.");
        return;
    }
    monthlyIncome = value;
    localStorage.setItem("monthlyIncome", monthlyIncome);
    updateRemainingBalance();
});

function updateRemainingBalance() {
    const totalExpenses = allExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const remaining = monthlyIncome - totalExpenses;
    const remainingDisplay = document.getElementById("remainingBalance");
    remainingDisplay.textContent = `Remaining Balance: ₹${remaining.toFixed(2)}`;
    remainingDisplay.style.color = remaining < 0 ? "red" : "green";
}

// ===== FETCH LIST =====
async function fetchExpenses() {
    try {
        const res = await fetch(API_URL, { credentials: "same-origin" });
        if (!res.ok) throw new Error("Failed to fetch expenses");
        allExpenses = await res.json();
        renderExpenses(allExpenses, true);
        updateRemainingBalance();
    } catch (error) {
        console.error(error);
        alert("Could not load expenses.");
    }
}

// ===== RENDER TABLE =====
function renderExpenses(expenses, animate = false) {
    const tbody = document.querySelector("#expenseTable tbody");
    tbody.innerHTML = "";

    expenses.forEach((expense, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.title}</td>
            <td>${parseFloat(expense.amount).toFixed(2)}</td>
            <td>${expense.date}</td>
            <td>${expense.description || ""}</td>
            <td>
                <button class="edit-btn" onclick="editExpense(${expense.id})">Edit</button>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;

        if (animate) {
            row.style.opacity = "0";
            row.style.transform = "translateY(10px)";
            setTimeout(() => {
                row.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                row.style.opacity = "1";
                row.style.transform = "translateY(0)";
            }, 50 * index);
        }

        tbody.appendChild(row);
    });
}

// ===== FILTERS =====
function applyFilters() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const filterDate = document.getElementById("filterDate").value;

    let filtered = allExpenses.filter(exp =>
        (exp.title.toLowerCase().includes(searchValue) ||
         (exp.description && exp.description.toLowerCase().includes(searchValue)))
    );

    if (filterDate) {
        filtered = filtered.filter(exp => exp.date === filterDate);
    }

    renderExpenses(filtered, true);
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("filterDate").addEventListener("change", applyFilters);
document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("filterDate").value = "";
    renderExpenses(allExpenses, true);
});

// ===== CREATE / UPDATE =====
document.getElementById("expenseForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("expenseId").value;
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}${id}/` : API_URL;

    const expenseData = {
        title: document.getElementById("title").value.trim(),
        amount: document.getElementById("amount").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value.trim()
    };

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            credentials: "same-origin",
            body: JSON.stringify(expenseData)
        });

        if (!res.ok) throw new Error("Failed to save expense");

        document.getElementById("expenseForm").reset();
        document.getElementById("expenseId").value = "";
        fetchExpenses();
        updateRemainingBalance();
    } catch (error) {
        console.error(error);
        alert("Could not save expense.");
    }
});

// ===== EDIT =====
async function editExpense(id) {
    try {
        const res = await fetch(`${API_URL}${id}/`, { credentials: "same-origin" });
        if (!res.ok) throw new Error("Failed to fetch expense");
        const exp = await res.json();

        document.getElementById("expenseId").value = exp.id;
        document.getElementById("title").value = exp.title;
        document.getElementById("amount").value = exp.amount;
        document.getElementById("date").value = exp.date;
        document.getElementById("description").value = exp.description || "";
        document.getElementById("saveBtn").textContent = "Update Expense";
    } catch (error) {
        console.error(error);
        alert("Could not load expense to edit.");
    }
}

// ===== DELETE =====
async function deleteExpense(id) {
    try {
        const res = await fetch(`${API_URL}${id}/`, {
            method: "DELETE",
            headers: { "X-CSRFToken": getCSRFToken() },
            credentials: "same-origin"
        });
        if (!res.ok) throw new Error("Failed to delete");
        fetchExpenses();
        updateRemainingBalance();
        // If the deleted one was being edited, reset the form label
        document.getElementById("saveBtn").textContent = "Save Expense";
        document.getElementById("expenseForm").reset();
        document.getElementById("expenseId").value = "";
    } catch (error) {
        console.error(error);
        alert("Could not delete expense.");
    }
}

// Expose for inline onclick
window.editExpense = editExpense;
window.deleteExpense = deleteExpense;

// Handle Add Expense form
document.getElementById("addExpenseForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const expenseData = {
        title: document.getElementById("title").value,
        amount: document.getElementById("amount").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value
    };

    fetch('https://nitu123.pythonanywhere.com/api/expenses/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        credentials: "same-origin",
        body: JSON.stringify(expenseData),
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to add expense");
        return response.json();
    })
    .then(data => {
        alert("Expense added successfully!");
        fetchExpenses();  // reload table without full page refresh
        updateRemainingBalance();
        document.getElementById("addExpenseForm").reset();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Could not add expense.");
    });

}); 

