import { Routes } from '@angular/router';
import { LoginGuardGuard } from './login-guard.guard';

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then( m => m.SplashPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'log',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'cosasLindas',
    loadComponent: () => import('./cosas-lindas/cosas-lindas.component').then((m) => m.CosasLindasComponent),
  },
  {
    path: 'cosasFeas',
    loadComponent: () => import('./cosas-feas/cosas-feas.component').then((m) => m.CosasFeasComponent),
  },
  {
    path: 'mis/fotos',
    loadComponent: () => import('./mis-photos/mis-photos.component').then((m) => m.MisPhotosComponent),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
];
