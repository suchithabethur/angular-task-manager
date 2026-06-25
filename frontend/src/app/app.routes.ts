import { Routes } from '@angular/router';
import { Login } from './login/login';
import { App } from './app';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'tasks',
    component: App,
    canActivate: [() => {
      const token = localStorage.getItem('token');
      return !!token; // Allow access if token exists
    }]
  }
];
