module.exports = {
  httpOnly: true, // The cookie only accessible by the web server
  signed: false, // Indicates if the cookie should be signed
  secure: process.env.COOKIE_SECURE === 'true', // Indicates if the cookie should only be sent over SSL.
  maxAge: 1000 * process.env.COOKIE_MAX_AGE || 604800, // would expire after X seconds
  domain: process.env.COOKIE_DOMAIN, // The domain of the cookie
  sameSite: process.env.COOKIE_SAMESITE || 'Strict', // The cookie should be sent only over HTTPS
  path: process.env.COOKIE_PATH || '/' // The path of the cookie
}
