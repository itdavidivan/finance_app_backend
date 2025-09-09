import express from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
const db = drizzle(process.env.DATABASE_URL!);
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/auth/register", (req, res) => {
  res.send("Register endpoint");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
