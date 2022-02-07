export async function fetchBookList() {
  const response = await fetch('http://127.0.0.1:8080/books');

  if (!response.ok) {
    throw new Error('Problem fetching books');
  }

  return await response.json();
}