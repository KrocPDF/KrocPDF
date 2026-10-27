// API Base URL with fallback to Docker compose port 3001, stripping trailing slashes
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
export const getApiUrl = () => API_BASE_URL;
