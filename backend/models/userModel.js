const pool = require("../config/db");

const createUser = async (name, email, password) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;

  const values = [name, email, password];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

const findUserById = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [userId]
  );

  return result.rows[0];
};

const getUserProfile = async (userId) => {
  const query = `
    SELECT
      id,
      name,
      email,
      created_at
    FROM users
    WHERE id = $1;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0];
};

const updateUserProfile = async (
  userId,
  name,
  email
) => {
  const query = `
    UPDATE users
    SET
      name = $1,
      email = $2
    WHERE id = $3
    RETURNING
      id,
      name,
      email,
      created_at;
  `;

  const values = [name, email, userId];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const updateUserPassword = async (userId, hashedPassword) => {
  const query = `
    UPDATE users
    SET password = $1
    WHERE id = $2
    RETURNING id, name, email, created_at;
  `;

  const values = [hashedPassword, userId];

  const result = await pool.query(query, values);

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
};