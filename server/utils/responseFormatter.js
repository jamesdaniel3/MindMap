// utils/responseFormatter.js

/**
 * Format API response consistently
 * @param {*} data - Response data
 * @param {Object} options - Response options
 * @returns {Object} - Formatted response
 */
function formatResponse(data, options = {}) {
  const {
    success = true,
    error = null,
    statusCode = 200,
    message = null,
    meta = {},
  } = options;

  return {
    success,
    statusCode,
    data,
    error,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  formatResponse,
};
