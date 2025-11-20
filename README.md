# 🌐 Experience 365

**Interactive platform connecting users with providers of personalized leisure activities.**  
Developed with **React.js** for the frontend and **Flask (Python)** for the backend, using **SQLAlchemy** as the database abstraction layer.

This project combines a modern stack, agile deployment, and an architecture designed to scale new features quickly and efficiently.

---

## 🚀 Technologies Used

- **Frontend:** React.js
- **Backend:** Python + Flask
- **Database:** SQLAlchemy + PostgreSQL (compatible with SQLite and MySQL)
- **Package Managers:** Pipenv (for Python) and NPM (for JS)
- **Recommended Environment:** GitHub Codespaces or local setup with Python 3.10 and Node 20+

---

## 📦 Main Features

- 📚 Modular architecture ready to scale new functionalities.
- 🧰 `.env` configuration to separate credentials and sensitive variables.
- 🛠️ Full integration with SQLAlchemy for easy model and migration handling.
- 🌍 Ready for deployment on **Render** or **Heroku** in just minutes.
- 🧪 Scripts to quickly generate test data.

---

## 🛠️ Backend Installation

> Make sure you have **Python 3.10**, **Pipenv**, and a database engine installed (PostgreSQL is recommended).

1. Install Python dependencies:

   ```bash
   pipenv install

   ```

2. Create the `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

3. Set the `DATABASE_URL` variable with your credentials:

| Engine   | DATABASE_URL                                    |
| -------- | ----------------------------------------------- |
| SQLite   | sqlite:////test.db                              |
| MySQL    | mysql://user:password@localhost:3306/example    |
| Postgres | postgres://user:password@localhost:5432/example |

4. Migrate the database:

   ```bash
   pipenv run migrate
   pipenv run upgrade
   ```

5. Start the backend server:
   ```bash
   pipenv run start
   ```

---

## 🔄 Undo a Migration

If you need to revert a migration:

```bash
pipenv run downgrade
```

---

## 👤 Populate the Database with Test Useres

you can insert sample users with:

```bash
flask insert-test-data
```

This will automatically generate several records in your database for development purposes.

---

## 💻 Frontend installation

> Make sure **Node.js versión 20** is installed and then backend is running properly.

1. Install Node dependences:

   ```bash
   npm install
   ```

2. Start the React development server:
   ```bash
   npm run start
   ```

---

## 🌍 Deployment

Experience 365 is ready to be doployed quickly on **Render** or **Heroku**.  
Check Render's documentation for detailed deployment steps.

---

## 👥 Credits

Project developed as part of the final project for the Full Stack Developer Bootcamp at [**4Geeks Academy**](https://www.4geeksacademy.com).

#### Experience365 Team:

- **David Querol** — Fullstack Developer
- **Melani Medigovich** - Fullstack Developer
- **Sergio García** - Fullstack Developer

Inspired by the original template from [**Alejandro Sánchez**](https://x.com/alesanchezr)
and contributors from [**4Geeks Academy**](https://www.4geeksacademy.com).
