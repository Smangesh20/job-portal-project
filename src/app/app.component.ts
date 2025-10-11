import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'AskYaCham - Professional Job Portal';

  ngOnInit(): void {
    // Initialize Google services when app starts
    this.initializeGoogleServices();
  }

  private initializeGoogleServices(): void {
    // Load Google Identity Services
    this.loadGoogleIdentityServices();
  }

  private loadGoogleIdentityServices(): void {
    // Create script element for Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('Google Identity Services loaded successfully');
    };

    script.onerror = (error) => {
      console.error('Failed to load Google Identity Services:', error);
    };
  }
}
