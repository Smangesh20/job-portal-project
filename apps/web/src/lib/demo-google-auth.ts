// 🚀 DEMO GOOGLE AUTH - Works immediately without setup
// This service provides Google Sign-In functionality for immediate testing

export interface DemoGoogleUser {
  id: string
  email: string
  name: string
  given_name: string
  family_name: string
  picture: string
  verified_email: boolean
}

export interface DemoGoogleAuthResponse {
  success: boolean
  user?: DemoGoogleUser
  error?: string
}

// 🚀 DEMO GOOGLE AUTH SERVICE
export class DemoGoogleAuthService {
  
  // 🚀 DEMO GOOGLE SIGN-IN (Works immediately)
  async signInWithGoogle(): Promise<DemoGoogleAuthResponse> {
    try {
      console.log('🚀 DEMO GOOGLE AUTH - Initiating Google Sign-In...')
      
      // 🚀 SIMULATE GOOGLE OAUTH FLOW
      const demoUser: DemoGoogleUser = {
        id: 'demo_google_user_123',
        email: 'demo@askyacham.com',
        name: 'Demo User',
        given_name: 'Demo',
        family_name: 'User',
        picture: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=G',
        verified_email: true
      }

      console.log('🚀 DEMO GOOGLE AUTH - User signed in:', demoUser)
      
      return {
        success: true,
        user: demoUser
      }

    } catch (error) {
      console.error('🚨 Demo Google Auth error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Demo auth failed'
      }
    }
  }

  // 🚀 DEMO GOOGLE OAUTH URL (For testing)
  getGoogleAuthUrl(): string {
    return 'https://accounts.google.com/o/oauth2/v2/auth?client_id=demo&redirect_uri=demo&response_type=code&scope=openid%20email%20profile'
  }

  // 🚀 DEMO GOOGLE CALLBACK (For testing)
  async handleGoogleCallback(code: string, state: string): Promise<DemoGoogleAuthResponse> {
    try {
      console.log('🚀 DEMO GOOGLE CALLBACK - Processing callback...')
      
      // 🚀 SIMULATE GOOGLE USER DATA
      const demoUser: DemoGoogleUser = {
        id: `demo_user_${Date.now()}`,
        email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
        name: 'Google User',
        given_name: 'Google',
        family_name: 'User',
        picture: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=G',
        verified_email: true
      }

      console.log('🚀 DEMO GOOGLE CALLBACK - User authenticated:', demoUser)
      
      return {
        success: true,
        user: demoUser
      }

    } catch (error) {
      console.error('🚨 Demo Google Callback error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Demo callback failed'
      }
    }
  }
}

// 🚀 CREATE SINGLETON INSTANCE
export const demoGoogleAuth = new DemoGoogleAuthService()
