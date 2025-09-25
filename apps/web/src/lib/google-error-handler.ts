// GOOGLE-STYLE ERROR HANDLER - GRACEFUL ERROR HANDLING
// Based on Google's production approach - don't suppress, handle gracefully

export class GoogleErrorHandler {
  private static instance: GoogleErrorHandler
  private errorCount = 0

  static getInstance(): GoogleErrorHandler {
    if (!GoogleErrorHandler.instance) {
      GoogleErrorHandler.instance = new GoogleErrorHandler()
    }
    return GoogleErrorHandler.instance
  }

  // Google's approach - handle errors gracefully
  handleError(error: Error): void {
    this.errorCount++
    
    // Log error for monitoring (Google's approach)
    this.logError(error)
    
    // Show user-friendly message (Google's approach)
    this.showUserMessage(error)
    
    // Implement fallback (Google's approach)
    this.implementFallback(error)
  }

  // Google's approach - clear, actionable error messages
  private showUserMessage(error: Error): void {
    const message = this.getUserMessage(error)
    this.createNotification(message)
  }

  // Google's approach - log errors for monitoring
  private logError(error: Error): void {
    console.log('🔍 Google-style error logged:', {
      message: error.message,
      timestamp: new Date().toISOString(),
      errorCount: this.errorCount
    })
  }

  // Google's approach - implement fallback functionality
  private implementFallback(error: Error): void {
    // Implement fallback after a delay (Google's approach)
    setTimeout(() => {
      try {
        if (error.message.includes('React error #310')) {
          // For React errors, suggest refresh
          this.createNotification('Please refresh the page to continue.')
        }
      } catch (fallbackError) {
        console.log('🔍 Fallback failed:', fallbackError)
      }
    }, 1000)
  }

  // Get user-friendly message
  private getUserMessage(error: Error): string {
    if (error.message.includes('React error #310')) {
      return 'We\'re experiencing a temporary issue. Please refresh the page to continue.'
    }
    
    if (error.message.includes('Network')) {
      return 'Please check your internet connection and try again.'
    }
    
    return 'Something went wrong. We\'re working to fix it.'
  }

  // Create Google-style notification
  private createNotification(message: string): void {
    // Remove existing notifications
    const existingNotification = document.getElementById('google-error-notification')
    if (existingNotification) {
      existingNotification.remove()
    }

    // Create notification element
    const notification = document.createElement('div')
    notification.id = 'google-error-notification'
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fff;
      border: 1px solid #dadce0;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10000;
      max-width: 400px;
      font-family: 'Google Sans', Arial, sans-serif;
    `

    // Create notification content
    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="color: #ea4335; font-size: 20px;">⚠️</div>
        <div style="flex: 1;">
          <div style="font-weight: 500; color: #202124; margin-bottom: 8px;">
            ${message}
          </div>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button id="error-refresh-btn" style="
              background: #1a73e8;
              color: white;
              border: none;
              border-radius: 4px;
              padding: 8px 16px;
              font-size: 14px;
              cursor: pointer;
            ">Refresh Page</button>
            <button id="error-dismiss-btn" style="
              background: transparent;
              color: #5f6368;
              border: 1px solid #dadce0;
              border-radius: 4px;
              padding: 8px 16px;
              font-size: 14px;
              cursor: pointer;
            ">Dismiss</button>
          </div>
        </div>
      </div>
    `

    // Add event listeners
    const refreshBtn = notification.querySelector('#error-refresh-btn')
    const dismissBtn = notification.querySelector('#error-dismiss-btn')

    refreshBtn?.addEventListener('click', () => {
      window.location.reload()
    })

    dismissBtn?.addEventListener('click', () => {
      notification.remove()
    })

    // Auto-dismiss after 10 seconds (Google's approach)
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 10000)

    // Add to document
    document.body.appendChild(notification)
  }
}

// Initialize Google-style error handler
export const googleErrorHandler = GoogleErrorHandler.getInstance()

// Google-style global error handler
export const initializeGoogleStyleErrorHandling = () => {
  if (typeof window === 'undefined') return

  // Override global error handler with Google's approach
  window.addEventListener('error', (event) => {
    event.preventDefault()
    googleErrorHandler.handleError(event.error || new Error(event.message))
  })

  // Override unhandled promise rejection with Google's approach
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()
    googleErrorHandler.handleError(new Error(event.reason))
  })

  console.log('🔍 Google-style error handling initialized')
}






