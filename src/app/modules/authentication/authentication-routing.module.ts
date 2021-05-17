import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginLayoutComponent } from '../../shared/layout/login-layout/login-layout.component';
import { AuthenticationComponent } from './authentication.component';
import { BridgeToDashboardComponent } from './bridge-to-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: AuthenticationComponent }
    ]
  },
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: AuthenticationComponent }
    ]
  },
  {
    path: 'bridge/:accountId',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: BridgeToDashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
