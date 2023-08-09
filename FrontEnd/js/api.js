const apiUrl = 'http://localhost:5678/api';

/**
 * Get all works
 * @returns {Promise<Array>}
 */
async function getWorks() {
  try {
    const response = await fetch(`${apiUrl}/works`);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
  return null;
}

/**
 * Generate a token for a user, require login and password
 * @param {string} login
 * @param {string} password
 * @returns {Promise<Array>}
 */
async function getUserToken(login, password) {
  try {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: login, password: password })
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
  return null;
}

/**
 * Delete an image by id
 * @param {number} workId
 * @returns {Promise<boolean>}
 */
async function deleteImageById(workId) {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    await fetch(`${apiUrl}/works/${workId}`, {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    });
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}

export default {
  getWorks,
  getUserToken,
  deleteImageById
};
