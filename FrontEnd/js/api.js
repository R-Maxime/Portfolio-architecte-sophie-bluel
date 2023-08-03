async function getWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  const json = await response.json();
  return json;
}

export default {
  getWorks
};
