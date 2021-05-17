import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/authentication/authentication.module').then(m=>m.AuthenticationModule)
},
{
    path: 'login',
    loadChildren: () => import('./modules/authentication/authentication.module').then(m=>m.AuthenticationModule)
},
{
    path: 'registration',
    loadChildren: () => import('./modules/registration/registration.module').then(m=>m.RegistrationModule)
},
{
    path: 'forgotpassword',
    loadChildren: () => import('./modules/forgotpassword/forgotpassword.module').then(m=>m.ForgotPasswordModule)
},
{
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m=>m.HomeModule),
    canActivate: [AuthGuard]
},
{
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m=>m.DashboardModule),
    canActivate: [AuthGuard]
},
{
    path: 'onboardindex',
    loadChildren: () => import('./modules/onboardindex/onboardindex.module').then(m=>m.OnBoardIndexModule),
    canActivate: [AuthGuard]
},
{
    path: 'rundaily',
    loadChildren: () => import('./modules/rundaily/rundaily.module').then(m=>m.RunDailyModule),
    canActivate: [AuthGuard]
},
{
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m=>m.AdminModule),
    canActivate: [AuthGuard]
},
{
    path: 'error',
    loadChildren: () => import('./modules/error/error.module').then(m=>m.ErrorModule)
},
{
    path: 'test',
    loadChildren: () => import('./modules/test/test.module').then(m=>m.TestModule)
},
{
    path: '**', 
    redirectTo: 'error', 
    pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
