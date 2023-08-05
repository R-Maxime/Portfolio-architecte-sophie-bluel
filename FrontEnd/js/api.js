async function getWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
  return null;
}

async function getUserToken(login, password) {
  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
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

export default {
  getWorks,
  getUserToken
};
