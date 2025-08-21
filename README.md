# 💰 Django Expense Tracker

A simple yet powerful **Expense Tracker Web Application** built with **Django**.This project helps users to manage their monthly income and expenses, categorize spending, and keep track of remaining balance.

---

## 🚀 Features
- Set **monthly income** and calculate remaining balance.
- **Add, Edit, Delete** expenses with details.
- Filter/search expenses by **title, description, or date**.
- Track expenses across multiple categories (Groceries, Insurance, Healthcare, etc.).
- Displays a clean summary of expenses in tabular format.
- Docker support for containerized deployment.

---

## 🛠️ Tech Stack
- **Backend:** Django, Python  
- **Frontend:** HTML, CSS, Bootstrap  
- **Database:** SQLite (default, can be replaced with PostgreSQL/MySQL)  
- **Containerization:** Docker & Docker Compose  

---

## ⚡ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/django-expense-tracker.git
cd django-expense-tracker

```
### 2️⃣ Create Virtual Environment & Install Dependencies

```bash

python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows

pip install -r requirements.txt

```

### 3️⃣ Run Migrations

```bash

python manage.py migrate

```

### 4️⃣ Run the Server

```bash

python manage.py runserver

```
Access the app at http://127.0.0.1:8000/
 🎉

🐳 Run with Docker

```bash
docker-compose -f docker-compose.dev.yml up --build

```

### 📸 Screenshots

<img width="1488" height="732" alt="Image" src="https://github.com/user-attachments/assets/637e85b5-d2c6-4a04-915d-d01e72fee2fa" />


### 👨‍💻 Developer

Developed by CoderNitu.
Feel free to ⭐ the repo if you like it!

