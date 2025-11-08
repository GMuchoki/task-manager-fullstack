import Database from "better-sqlite3";

const db = new Database("./database.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        middle_name TEXT,
        last_name TEXT NOT NULL,
        username TEXT UNIQUE,
        password TEXT
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`);

export default db;