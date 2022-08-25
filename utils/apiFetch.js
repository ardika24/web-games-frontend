const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function apiFetch(path, fetchOptions) {
  return fetch(apiBaseUrl + path, fetchOptions);
}

export default apiFetch;
