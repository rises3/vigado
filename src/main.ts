import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeAnalytics } from './firebase';

initializeAnalytics().catch((err) => console.error('Firebase Analytics initialization failed:', err));

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
