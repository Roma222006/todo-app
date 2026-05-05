const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// 🔥 SERVE FRONTEND (IMPORTANT)
app.use(express.static(path.join(__dirname, "../frontend")));


// ================= DB CONNECTION =================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Roma2006#",
    database: "todo_app"
});

db.connect(err => {
    if (err) {
        console.log("❌ DB CONNECTION ERROR:", err);
        return;
    }
    console.log("✅ MySQL Connected");
});


// ================= ROUTES =================

// 🏠 DEFAULT ROUTE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});


// 🔐 REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err) => {
            if (err) {
                console.log("REGISTER ERROR:", err);
                return res.json({ success: false });
            }
            res.json({ success: true });
        }
    );
});


// 🔐 LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, result) => {

            if (err) {
                console.log("LOGIN ERROR:", err);
                return res.json({ success: false });
            }

            if (result.length > 0) {
                res.json({
                    success: true,
                    user: {
                        id: result[0].id,
                        username: result[0].username
                    }
                });
            } else {
                res.json({ success: false });
            }
        }
    );
});


// ➕ ADD TASK
app.post("/addTask", (req, res) => {
    const { task, date, time, priority, user_id, username } = req.body;

    db.query(
        "INSERT INTO tasks (task, date, time, priority, completed, user_id, username) VALUES (?, ?, ?, ?, false, ?, ?)",
        [task, date, time, priority, user_id, username],
        (err) => {
            if (err) {
                console.log("ADD TASK ERROR:", err);
                return res.json({ success: false });
            }
            res.json({ success: true });
        }
    );
});


// 📊 GET TASKS (USER-WISE)
app.get("/tasks/:user_id", (req, res) => {
    db.query(
        "SELECT * FROM tasks WHERE user_id=?",
        [req.params.user_id],
        (err, result) => {
            if (err) {
                console.log("GET TASK ERROR:", err);
                return res.json([]);
            }
            res.json(result);
        }
    );
});


// ❌ DELETE TASK
app.delete("/task/:id", (req, res) => {
    db.query(
        "DELETE FROM tasks WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) {
                console.log("DELETE ERROR:", err);
                return res.json({ success: false });
            }
            res.json({ success: true });
        }
    );
});


// 🔄 UPDATE TASK (TOGGLE + EDIT)
app.put("/task/:id", (req, res) => {

    // ✔ TOGGLE COMPLETE
    if (req.body.completed !== undefined) {
        db.query(
            "UPDATE tasks SET completed=? WHERE id=?",
            [req.body.completed, req.params.id],
            (err) => {
                if (err) {
                    console.log("TOGGLE ERROR:", err);
                    return res.json({ success: false });
                }
                return res.json({ success: true });
            }
        );
    }

    // ✏️ EDIT TASK
    else if (req.body.task) {
        db.query(
            "UPDATE tasks SET task=? WHERE id=?",
            [req.body.task, req.params.id],
            (err) => {
                if (err) {
                    console.log("EDIT ERROR:", err);
                    return res.json({ success: false });
                }
                return res.json({ success: true });
            }
        );
    }
});


// ================= START SERVER =================
app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});