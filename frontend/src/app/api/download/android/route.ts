import { NextResponse } from 'next/server';
import { ANDROID_APK_DOWNLOAD_URL } from '@/lib/api';

/**
 * GET /api/download/android
 * Permanent dynamic resolver for the Android APK binary.
 * Redirects to the configured CDN / GitHub Releases link if available,
 * or the statically bundled fallback in /downloads/KROC_APK.apk.
 */
export async function GET(request: Request) {
  const destination = ANDROID_APK_DOWNLOAD_URL.startsWith('http://') || ANDROID_APK_DOWNLOAD_URL.startsWith('https://')
    ? ANDROID_APK_DOWNLOAD_URL
    : new URL(ANDROID_APK_DOWNLOAD_URL, request.url);

  return NextResponse.redirect(destination, {
    status: 307,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
