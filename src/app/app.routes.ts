import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { User } from './user/user';
import { Employee } from './employee/employee';
import { Admin } from './admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: 'homepage', component: Homepage },
  { path: 'user', component: User },
  { path: 'employee', component: Employee },
  { path: 'admin', component: Admin },
];