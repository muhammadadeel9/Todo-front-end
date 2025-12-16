// cookieUtils.js

/**
 * Gets the value of a specific cookie by name.
 * @param {string} name The name of the cookie to retrieve.
 * @returns {string | null} The cookie value, or null if not found.
 */
export const getToken = () => {
  const name = 'token'; // Use a consistent name for your token cookie
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

/**
 * Sets a cookie with a given name, value, and expiration days.
 * @param {string} name The name of the cookie.
 * @param {string} value The value to store.
 * @param {number} days The number of days until the cookie expires.
 */
// export const setToken = (value, days) => {
//   const name = 'authToken';
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//     expires = "; expires=" + date.toUTCString();
//   }
//   // Ensure the cookie is secure and HTTPOnly (if possible via backend setting)
//   document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
// };

/**
 * Deletes the authentication token cookie.
 */
export const removeToken = () => {
  try {
    const name = 'token';
    document.cookie = name + '=; Max-Age=-99999999; path=/';
  } catch (error) {
    console.error('Error while removing token cookie:', error);
  }
};
