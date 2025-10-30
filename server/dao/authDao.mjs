import db from "../db.mjs";
import crypto from "crypto";
import { promisify } from "util";

// Promisify the scrypt function for async/await usage
const scryptAsync = promisify(crypto.scrypt);

const loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE username=?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(false); // No user found with the given username
      } else {
        // User details
        const user = {
          id: row.id,
          username: row.username,
          email: row.email,
          role: row.role,
        };

        // Hash the input password with the stored salt
        scryptAsync(password, row.salt, 32)
          .then((hashedPassword) => {
            // Compare the hashed password with the stored password_hash
            if (
              !crypto.timingSafeEqual(
                Buffer.from(row.password_hash, "hex"),
                hashedPassword
              )
            ) {
              resolve(false); // Passwords do not match
            } else {
              resolve(user); // Authentication successful
            }
          })
          .catch((err) => {
            reject(err); // Error during hashing
          });
      }
    });
  });
};

export default { loginUser };
