import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
  successMessage?: string;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { successMessage, ...customOptions } = options;

  // Recuperamos el token si el usuario ya inició sesión
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...customOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...customOptions.headers,
      },
    });

    if (!response.ok) {
      // Si el backend devuelve 401 (No autorizado) o 403, puedes redirigir al login
      if (response.status === 401) {
         localStorage.removeItem('token');
         window.location.href = '/login';
      }

      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || 'Ocurrió un error en la operación.';

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      if (successMessage) toast.success(successMessage);
      return {} as T;
    }

    const data = await response.json();

    if (successMessage) toast.success(successMessage);

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      toast.error('No se pudo conectar con el servidor.');
    }
    throw error;
  }
}