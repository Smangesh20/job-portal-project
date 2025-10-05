import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { JobSearchComponent } from './job-search/job-search.component';
import { ProfileComponent } from './profile/profile.component';
import { ApplicationsComponent } from './applications/applications.component';
import { SettingsComponent } from './settings/settings.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'jobs',
        pathMatch: 'full'
      },
      {
        path: 'jobs',
        component: JobSearchComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'applications',
        component: ApplicationsComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  }
];
