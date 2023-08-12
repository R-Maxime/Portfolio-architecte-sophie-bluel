const apiUrl = 'http://localhost:5678/api';

/**
 *  Get all categories
 * @returns {Promise<Array>}
 */
async function getCategories() {
  try {
    const response = await fetch(`${apiUrl}/categories`);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
  return null;
}

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

async function addImages(formData) {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    await fetch(`${apiUrl}/works`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    return 'success';
  } catch (error) {
    console.log(error);
    return error.message;
  }
}

/**
 * Delete all works
 */
async function deleteAllWorks() {
  const works = await getWorks();
  for (const work of works) {
    await deleteImageById(work.id);
  }
}

export default {
  getWorks,
  getUserToken,
  deleteImageById,
  deleteAllWorks,
  getCategories,
  addImages
};
