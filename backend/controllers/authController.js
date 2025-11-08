import db from "../db/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isValidName, isValidPassword, isValidUsername } from "../utils/validators.js";

dotenv.config();

export const signup = (req, res) => {
    const { first_name, middle_name, last_name, username, password } = req.body;

    if (!first_name || !last_name || !username || !password) {
        return res.status(400).json({ 
            error: "first_name, last_name, username, and password are required"
        });
    }

    if (!isValidName(first_name) || !isValidName(last_name)) {
        return res.status(400).json({
            error: "Names must contain only letters, spaces, or hyphens (2–50 characters)",
        });
    }

    if (!isValidUsername(username)) {
        return res.status(400).json({
            error: "Username must be 3–20 characters long and contain only letters, numbers, or underscores",
        });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({
            error:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (#?!@$%^&*.-_)",
        });
    }

    const hashed = bcrypt.hashSync(password, 10);

    try {
        db.prepare(`INSERT INTO users (first_name, middle_name, last_name, username, password) VALUES (?, ?, ?, ?, ?)`).run(first_name, middle_name, last_name, username, hashed);

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        if (err.message.includes("UNIQUE")) {
            res.status(400).json({ error: "Username already exists" });
        } else {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        }
    }
};

export const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            error: "username and password are required"
        });
    }

    if (!isValidUsername(username)) {
        return res.status(400).json({
            error: "Invalid username format",
        });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({
            error:
            "Password format invalid. It must be at least 8 characters long and contain uppercase, lowercase, number, and special character (#?!@$%^&*.-_)",
        });
    }

    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            username: user.username,
        },
    });
};