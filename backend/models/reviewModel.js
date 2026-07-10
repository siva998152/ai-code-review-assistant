const pool = require("../config/db");

const createReview = async (userId, code, analysis) => {
  const query = `
    INSERT INTO reviews (
      user_id,
      code,
      error_count,
      warning_count,
      total_findings,
      findings
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    userId,
    code,
    analysis.summary.errorCount,
    analysis.summary.warningCount,
    analysis.summary.totalFindings,
    JSON.stringify(analysis.findings),
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getReviewsByUserId = async (userId) => {
  const query = `
    SELECT
      id,
      user_id,
      code,
      error_count,
      warning_count,
      total_findings,
      findings,
      created_at
    FROM reviews
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

const getReviewById = async (reviewId, userId) => {
  const query = `
    SELECT
      id,
      user_id,
      code,
      error_count,
      warning_count,
      total_findings,
      findings,
      created_at
    FROM reviews
    WHERE id = $1
      AND user_id = $2;
  `;

  const result = await pool.query(query, [
    reviewId,
    userId,
  ]);

  return result.rows[0];
};

const deleteReviewById = async (reviewId, userId) => {
  const query = `
    DELETE FROM reviews
    WHERE id = $1
      AND user_id = $2
    RETURNING id;
  `;

  const result = await pool.query(query, [
    reviewId,
    userId,
  ]);

  return result.rows[0];
};

module.exports = {
  createReview,
  getReviewsByUserId,
  getReviewById,
  deleteReviewById,
};