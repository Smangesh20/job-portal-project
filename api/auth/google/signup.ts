import { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, handleOptions } from '../../_utils';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXTAUTH_URL 
  ? `${process.env.NEXTAUTH_URL}/api/auth/google/signup/callback`
  : 'http://localhost:4200/api/auth/google/signup/callback';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  try {
    // Generate state for CSRF protection
    const state = generateState('signup');

    // Build Google OAuth URL with consent prompt for signup
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent', // Force consent screen for signup
      state: state,
      include_granted_scopes: 'true'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    // Redirect to Google OAuth
    setCorsHeaders(res);
    res.redirect(authUrl);

  } catch (error: any) {
    console.error('Google signup error:', error);
    setCorsHeaders(res);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate Google signup'
    });
  }
}

function generateState(action: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return Buffer.from(`${action}:${timestamp}:${random}`).toString('base64');
}

