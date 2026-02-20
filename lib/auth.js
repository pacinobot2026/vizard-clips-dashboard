import bcrypt from 'bcryptjs';
import cookie from 'cookie';

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'VizardClips2026!';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change_me_in_production';

// Simple session token (in production, use JWT or proper session management)
export function createSessionToken() {
  return Buffer.from(`${SESSION_SECRET}:${Date.now()}`).toString('base64');
}

export function verifySessionToken(token) {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return decoded.startsWith(SESSION_SECRET);
  } catch {
    return false;
  }
}

export function verifyPassword(password) {
  return password === DASHBOARD_PASSWORD;
}

export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'strict',
    path: '/'
  }));
}

export function getAuthToken(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.auth_token;
}

export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', cookie.serialize('auth_token', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/'
  }));
}
