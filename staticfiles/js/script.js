const apiBase = "http://localhost:8000/api/expenses/"; // Your DRF endpoint

async function fetchExpenses() {
    const res = await fetch(apiBase);
    const data = await res.json();
    const list = document.getElementById('expenseList');
    list.innerHTML = '';
    data.forEach(exp => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${exp.title}</strong> - ₹${exp.amount} (${exp.category})<br>
            Date: ${exp.date} | ${exp.description || ''} 
            <button class="action-btn edit-btn" onclick="editExpense(${exp.id})">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
        `;
        list.appendChild(li);
    });
}

async function editExpense(id) {
    const res = await fetch(`${apiBase}${id}/`);
    const exp = await res.json();

    document.getElementById('expenseId').value = exp.id;
    document.getElementById('title').value = exp.title;
    document.getElementById('amount').value = exp.amount;
    document.getElementById('date').value = exp.date;
    document.getElementById('description').value = exp.description || '';
}

async function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    await fetch(`${apiBase}${id}/`, { method: 'DELETE' });
    fetchExpenses();
}

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('expenseId').value;
    const title = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const payload = { title, amount, date, description };

    if (id) {
        // Update
        await fetch(`${apiBase}${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        // Create
        await fetch(apiBase, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    document.getElementById('expenseForm').reset();
    document.getElementById('expenseId').value = '';
    fetchExpenses();
});

fetchExpenses();
