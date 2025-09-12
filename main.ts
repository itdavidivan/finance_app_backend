import express from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./lib/drizzle/schema.ts";
import * as schema from "./lib/drizzle/schema.ts"; // dôležité pre typovanie DB
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/auth.ts";

const db = drizzle(process.env.DATABASE_URL!, { schema });
const app = express();

app.use(cors());
app.use(express.json());

// 🌍 Hello route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// 📝 Register
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Skontroluj, či už existuje používateľ
    const existingUser = await db.query.usersTable.findFirst({
      where: (u, { eq }) => eq(u.username, username),
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Zahashuj heslo
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Ulož do DB
    await db.insert(usersTable).values({
      username,
      password: hashedPassword,
    });

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 📝 Login
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("request body:", req.body, "request headers:", req.headers);
    // 1️⃣ Skontroluj, či user existuje
    const user = await db.query.usersTable.findFirst({
      where: (user, { eq }) => eq(user.username, username),
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Porovnaj heslo
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Vygeneruj JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 🟢 Start server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
