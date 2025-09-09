import express from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./lib/drizzle/schema.ts";
import cors from "cors";

const db = drizzle(process.env.DATABASE_URL!);
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/auth/register", async (req, res) => {
  try {
    await db
      .insert(usersTable)
      .values({ username: req.body.username, password: req.body.password });

    res.send("Register endpoint");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
