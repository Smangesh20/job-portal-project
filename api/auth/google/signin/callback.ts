import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  setCorsHeaders,
  handleOptions,
  createOrUpdateUser,
  getUserByEmail,
  errorResponse,
  successResponse
} from '../../../_utils';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXTAUTH_URL 
  ? `${process.env.NEXTAUTH_URL}/api/auth/google/signin/callback`
  : 'https://www.askyacham.com/api/auth/google/signin/callback';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  try {
    const { code, state, error } = req.query;

    // Check for OAuth errors
    if (error) {
      return redirectWithError(res, 'Google signin cancelled or failed');
    }

    if (!code || !state) {
      return redirectWithError(res, 'Invalid callback parameters');
    }

    // Verify state (CSRF protection)
    if (!verifyState(state as string, 'signin')) {
      return redirectWithError(res, 'Invalid state parameter');
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code as string);

    if (!tokens) {
      return redirectWithError(res, 'Failed to exchange authorization code');
    }

    // Get user info from Google
    const userInfo = await fetchGoogleUserInfo(tokens.access_token);

    if (!userInfo) {
      return redirectWithError(res, 'Failed to fetch user information');
    }

    // Check if user exists (for signin)
    const existingUser = getUserByEmail(userInfo.email);

    if (!existingUser) {
      return redirectWithError(res, 'User not found. Please sign up first.');
    }

    // Update user last login
    const user = createOrUpdateUser({
      id: userInfo.sub || userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      verified_email: userInfo.email_verified,
      provider: 'google'
    });

    // Generate session token
    const sessionToken = generateToken(user.id);

    // Redirect to dashboard with success
    const dashboardUrl = process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/dashboard?auth=success&token=${sessionToken}`
      : `http://localhost:4200/dashboard?auth=success&token=${sessionToken}`;

    setCorsHeaders(res);
    res.redirect(dashboardUrl);

  } catch (error: any) {
    console.error('Google signin callback error:', error);
    return redirectWithError(res, 'Internal server error');
  }
}

async function exchangeCodeForTokens(code: string): Promise<any> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      console.error('Token exchange failed:', await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return null;
  }
}

async function fetchGoogleUserInfo(accessToken: string): Promise<any> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      console.error('User info fetch failed:', await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}

function verifyState(state: string, expectedAction: string): boolean {
  try {
    const decoded = Buffer.from(state, 'base64').toString('utf-8');
    const [action, timestamp] = decoded.split(':');
    
    // Check action matches
    if (action !== expectedAction) {
      return false;
    }

    // Check timestamp is not too old (5 minutes)
    const stateTimestamp = parseInt(timestamp);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (now - stateTimestamp > fiveMinutes) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

function generateToken(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

function redirectWithError(res: VercelResponse, error: string): void {
  const errorUrl = process.env.NEXTAUTH_URL 
    ? `${process.env.NEXTAUTH_URL}/auth/signin?error=${encodeURIComponent(error)}`
    : `http://localhost:4200/auth/signin?error=${encodeURIComponent(error)}`;
  
  setCorsHeaders(res);
  res.redirect(errorUrl);
}

