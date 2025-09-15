const getAuthHeaders = () => {
  const token = localStorage.getItem('auth-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiCall = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired or invalid, logout user
    localStorage.removeItem('auth-token');
    window.location.reload();
    throw new Error('Session expired');
  }

  return response;
};

export const apiCallFormData = async (url: string, formData: FormData) => {
  const token = localStorage.getItem('auth-token');
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (response.status === 401) {
    localStorage.removeItem('auth-token');
    window.location.reload();
    throw new Error('Session expired');
  }

  return response;
};