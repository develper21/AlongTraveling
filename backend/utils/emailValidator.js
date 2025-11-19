/**
 * Normalize email to lowercase
 * @param {string} email - Email address
 * @returns {string} - Normalized email
 */
const normalizeEmail = (email = '') => {
  return email.toLowerCase().trim();
};

module.exports = {
  normalizeEmail
};
