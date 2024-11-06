const BASE_URL = import.meta.env.VITE_API_URL;

export async function request<T>(
  url: string,
  options: RequestInit = {},
  timeout: number = 5000,
): Promise<T> {
  const controller = new AbortController();
  const { signal } = controller;
  const fetchOptions = { ...options, signal };

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response: T = await fetch(BASE_URL + url, fetchOptions).then((res) =>
      res.json(),
    );
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
