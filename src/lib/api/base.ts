// When running in the browser, we want to use relative URLs
const API_BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8385');

// Log the API base URL for debugging
console.log('API Base URL:', API_BASE_URL);

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
      errorData = {
        message: 'An error occurred',
        details: response.statusText,
        status: response.status,
        statusText: response.statusText,
        url: response.url
      };
    }

    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error: errorData,
      headers: Object.fromEntries(response.headers.entries())
    });

    // If the error response is empty or missing a message, provide more context
    if (!errorData || Object.keys(errorData).length === 0 || !errorData.message) {
      errorData = {
        message: `Server returned ${response.status} ${response.statusText}`,
        details: 'The server responded with an empty error object',
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      };
    }

    throw new ApiError(response.status, errorData.message || 'An error occurred');
  }

  try {
    const data = await response.json();
    return data;
  } catch (parseError) {
    console.error('Error parsing response:', parseError, {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries())
    });
    throw new ApiError(500, 'Failed to parse server response');
  }
}

export async function get<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Fetching:', url, {
    method: 'GET',
    headers: defaultHeaders,
    // Removed credentials and mode to avoid CORS issues
    // credentials: 'include',
    // mode: 'cors'
  });

  try {
    console.log('Making fetch request to:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders,
      // Removed credentials and mode to avoid CORS issues
      // credentials: 'include',
      // mode: 'cors'
    });

    console.log('Response status:', response.status, {
      url: response.url,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error('Fetch error:', {
      error,
      url,
      endpoint,
      baseUrl: API_BASE_URL
    });

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError(0, 'Unable to connect to the server. Please check if the server is running and CORS is properly configured.');
    }
    if (error instanceof Error) {
      throw new ApiError(0, `Failed to connect to the server: ${error.message}`);
    }
    throw error;
  }
}

export async function post<T>(endpoint: string, data: unknown): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Posting to:', url, data);

  try {
    console.log('Making POST request to:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: defaultHeaders,
      // Removed credentials and mode to avoid CORS issues
      // credentials: 'include',
      // mode: 'cors',
      body: JSON.stringify(data)
    });

    console.log('Response status:', response.status, {
      url: response.url,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    return handleResponse<T>(response);
  } catch (error) {
    console.error('Fetch error:', {
      error,
      url,
      endpoint,
      baseUrl: API_BASE_URL,
      data
    });

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError(0, 'Unable to connect to the server. Please check if the server is running and CORS is properly configured.');
    }
    if (error instanceof Error) {
      throw new ApiError(0, `Failed to connect to the server: ${error.message}`);
    }
    throw error;
  }
}

export async function put<T>(endpoint: string, data: unknown): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Putting to:', url, data);

  try {
    console.log('Making PUT request to:', url);
    const response = await fetch(url, {
      method: 'PUT',
      headers: defaultHeaders,
      // Removed credentials and mode to avoid CORS issues
      // credentials: 'include',
      // mode: 'cors',
      body: JSON.stringify(data)
    });

    console.log('Response status:', response.status, {
      url: response.url,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    return handleResponse<T>(response);
  } catch (error) {
    console.error('Fetch error:', {
      error,
      url,
      endpoint,
      baseUrl: API_BASE_URL,
      data
    });

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError(0, 'Unable to connect to the server. Please check if the server is running and CORS is properly configured.');
    }
    if (error instanceof Error) {
      throw new ApiError(0, `Failed to connect to the server: ${error.message}`);
    }
    throw error;
  }
}

export async function del<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Deleting:', url);

  try {
    console.log('Making DELETE request to:', url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: defaultHeaders,
      // Removed credentials and mode to avoid CORS issues
      // credentials: 'include',
      // mode: 'cors'
    });

    console.log('Response status:', response.status, {
      url: response.url,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    return handleResponse<T>(response);
  } catch (error) {
    console.error('Fetch error:', {
      error,
      url,
      endpoint,
      baseUrl: API_BASE_URL
    });

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError(0, 'Unable to connect to the server. Please check if the server is running and CORS is properly configured.');
    }
    if (error instanceof Error) {
      throw new ApiError(0, `Failed to connect to the server: ${error.message}`);
    }
    throw error;
  }
}