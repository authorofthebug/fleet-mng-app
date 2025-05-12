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
    let responseText = '';
    
    // First try to get the response text
    try {
      responseText = await response.text();
    } catch (e) {
      responseText = 'Could not read response text';
    }
    
    // Then try to parse it as JSON
    try {
      errorData = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
      errorData = {
        message: responseText || 'An error occurred',
        details: response.statusText,
        status: response.status,
        statusText: response.statusText,
        url: response.url
      };
    }

    const errorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error: errorData,
      headers: Object.fromEntries(response.headers.entries()),
      responseText
    };

    console.error('API Error Response:', errorInfo);

    throw new ApiError(response.status, errorData?.message || `Server returned ${response.status} ${response.statusText}`);
  }

  try {
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    const data = JSON.parse(text);
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
  console.log('Fetching:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders,
    });

    console.log('Response received:', {
      status: response.status,
      url: response.url,
      statusText: response.statusText
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error('Network error during fetch:', {
      error: error instanceof Error ? error.message : String(error),
      url,
      endpoint,
      baseUrl: API_BASE_URL
    });

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError(0, 'Unable to connect to the server. Please check if the server is running and accessible.');
    }
    if (error instanceof Error) {
      throw new ApiError(0, `Network error: ${error.message}`);
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