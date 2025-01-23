const BASE_URL = import.meta.env.VITE_API_URL || '';

type ResponseType = 'json' | 'text';

export async function request<T>(
  url: string,
  options: RequestInit = {},
  responseType: ResponseType = 'json',
  timeout: number = 5000,
): Promise<T> {
  const controller = new AbortController();
  const { signal } = controller;
  const fetchOptions = { ...options, signal };

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(BASE_URL + url, fetchOptions);
    let response: T;

    if (responseType === 'json') {
      response = await res.json();
    } else {
      response = (await res.text()) as T;
    }

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
