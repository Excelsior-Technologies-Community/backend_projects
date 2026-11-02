const bcrypt = require("bcryptjs");
const { query } = require("../config/db");

const UserModel = {
  /**
   * Find user by email (including hashed password for authentication)
   */
  async findByEmail(email) {
    const rows = await query(
      "SELECT id, name, email, password, is_verified, otp, otp_expires_at, otp_last_sent_at, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase().trim()]
    );
    return rows[0] || null;
  },

  /**
   * Find user by ID (excluding password)
   */
  async findById(id) {
    const rows = await query(
      "SELECT id, name, email, is_verified, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new unverified user
   */
  async create({ name, email, password, otp, otpExpiresAt, otpLastSentAt }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password, is_verified, otp, otp_expires_at, otp_last_sent_at)
       VALUES (?, ?, ?, FALSE, ?, ?, ?)`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        otp,
        otpExpiresAt,
        otpLastSentAt
      ]
    );
    return {
      id: result.insertId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      is_verified: false
    };
  },

  /**
   * Update existing unverified user with new credentials/OTP
   */
  async updateUnverifiedUser(
    id,
    { name, password, otp, otpExpiresAt, otpLastSentAt }
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await query(
      `UPDATE users
       SET name = ?, password = ?, otp = ?, otp_expires_at = ?, otp_last_sent_at = ?
       WHERE id = ?`,
      [name.trim(), hashedPassword, otp, otpExpiresAt, otpLastSentAt, id]
    );
    return this.findById(id);
  },

  /**
   * Update OTP and cooldown timestamp
   */
  async updateOtp(id, { otp, otpExpiresAt, otpLastSentAt }) {
    await query(
      `UPDATE users
       SET otp = ?, otp_expires_at = ?, otp_last_sent_at = ?
       WHERE id = ?`,
      [otp, otpExpiresAt, otpLastSentAt, id]
    );
  },

  /**
   * Mark user email as verified and clear OTP fields
   */
  async verifyUser(id) {
    await query(
      `UPDATE users
       SET is_verified = TRUE, otp = NULL, otp_expires_at = NULL
       WHERE id = ?`,
      [id]
    );
    return this.findById(id);
  },

  /**
   * Compare plain password with stored bcrypt hash
   */
  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
};

module.exports = UserModel;
