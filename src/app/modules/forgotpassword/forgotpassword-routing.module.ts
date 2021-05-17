import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginLayoutComponent } from '../../shared/layout/login-layout/login-layout.component';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { UpdatePasswordComponent } from './updatepassword.component';

const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: ForgotPasswordComponent }
    ]
  },
  {
    path: 'update/:token',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: UpdatePasswordComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
