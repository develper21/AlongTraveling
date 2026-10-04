/**
 * Normalize email to lowercase
 * @param {string} email - Email address
 * @returns {string} - Normalized email
 */
const normalizeEmail = (email = '') => {
  return email.toLowerCase().trim();
};

/**
 * Check if an email belongs to the IIT Roorkee domain.
 * Supports departmental subdomains (e.g. cs.iitr.ac.in).
 * @param {string} email - Email address
 * @returns {boolean}
 */
const isValidIITREmail = (email = '') => {
  return /^[^\s@]+@([a-z0-9-]+\.)*iitr\.ac\.in$/i.test(email.trim());
};

module.exports = {
  normalizeEmail,
  isValidIITREmail,
};
