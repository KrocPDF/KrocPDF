// API Base URL with fallback to Docker compose port 3001, stripping trailing slashes
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
export const getApiUrl = () => API_BASE_URL;

// Android APK download URL: points to external CDN/GitHub Releases if configured via env var,
// or falls back to locally bundled static asset in public/downloads/KROC_APK.apk
export const ANDROID_APK_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_ANDROID_APK_URL || '/downloads/KROC_APK.apk';
