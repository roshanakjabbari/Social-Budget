import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve("./database.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err);
    process.exit(1);
  } else {
    console.log("Connected to the SQLite database.");
  }
});
export default db;
