import express from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable, expensesTable } from "./lib/drizzle/schema.ts";
import * as schema from "./lib/drizzle/schema.ts"; // dôležité pre typovanie DB
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/auth.ts";
import { eq, and } from "drizzle-orm";
import { sendExpenseAlert } from "./lib/sendEmail.ts";

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
    const { username, password, email } = req.body;

    const existingUser = await db.query.usersTable.findFirst({
      where: (u, { eq }) => eq(u.username, username) || eq(u.email, email),
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
      email,
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
// Pridavanie expenses
// app.post("/expenses", authMiddleware, async (req, res) => {
//   try {
//     const { amount, description, expenseType, createdAt } = req.body;
//     const userId = req.user!.id; // Získaj userId z JWT

//     const [newExpense] = await db
//       .insert(expensesTable)
//       .values({
//         userId,
//         amount,
//         description,
//         expenseType,
//         createdAt,
//       })
//       .returning();

//     res.json(newExpense);
//   } catch (error) {
//     console.error("Error adding expense:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// Získavanie expenses
app.get("/expenses", authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.id; // Získaj userId z JWT
    const dbResponse = await db.query.expensesTable.findMany({
      where: (e, { eq }) => eq(e.userId, userId),
    });

    res.json(dbResponse);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).send("Internal Server Error");
  }
});
//delete expense
app.delete("/expenses/:id", authMiddleware, async (req, res) => {
  try {
    const expenseId = req.params.id; // string | undefined
    if (!expenseId) {
      return res.status(400).send("Expense ID is required");
    }

    const userId = req.user!.id; // z JWT, string

    const deleted = await db.delete(expensesTable).where(
      and(
        eq(expensesTable.id, expenseId), // už bude string, nie undefined
        eq(expensesTable.userId, userId)
      )
    );

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/expenses", authMiddleware, async (req, res) => {
  try {
    const { amount, description, expenseType, createdAt } = req.body;
    const userId = req.user!.id;

    const [newExpense] = await db
      .insert(expensesTable)
      .values({ userId, amount, description, expenseType, createdAt })
      .returning();

    // >>>> NOVÁ ČASŤ <<<<
    if (Number(amount) > 100) {
      // môžeš poslať na fixný e-mail alebo na e-mail daného usera
      const user = await db.query.usersTable.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
      });

      const targetEmail = process.env.ALERT_EMAIL || user?.email;
      if (targetEmail) {
        sendExpenseAlert(targetEmail, Number(amount), description).catch(
          (err) => console.error("Email error:", err)
        );
      }
    }
    // >>>> KONIEC NOVÉHO <<<<

    res.json(newExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 8080; // fallback 8080 len lokálne
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
