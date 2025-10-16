/**
 * Validate if email is a valid IITR email
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid IITR email, false otherwise
 */
const isIITREmail = (email) => {
  const iitrEmailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*iitr\.ac\.in$/;
  return iitrEmailRegex.test(email);
};

/**
 * Extract enrollment number from IITR email if possible
 * @param {string} email - IITR email address
 * @returns {string|null} - Enrollment number or null
 */
const extractEnrollmentNumber = (email) => {
  const match = email.match(/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9-]+\.)*iitr\.ac\.in$/);
  return match ? match[1] : null;
};

/**
 * Normalize email to lowercase
 * @param {string} email - Email address
 * @returns {string} - Normalized email
 */
const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};

module.exports = {
  isIITREmail,
  extractEnrollmentNumber,
  normalizeEmail
};
