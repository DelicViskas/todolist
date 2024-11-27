export async function fetcher(url) {
  const
    response = await fetch(url);
  if (!response.ok) throw new Error('fetch' + response.status);
  return await response.json();
}