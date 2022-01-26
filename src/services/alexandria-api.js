export async function fetchBookList() {
  const response = await fetch('http://127.0.0.1:9090/api/book');

  if (!response.ok) {
    throw new Error('Problem fetching books');
  }

  return await response.json();
}

export async function postNewBook() {

}