import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { GrowlModule } from 'primeng/growl';

import { RegistrationRoutingModule } from './registration-routing.module';
import { RegistrationComponent } from './registration.component';
import { SharedModule } from '../../shared/shared.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegistrationRoutingModule,
    SharedModule,
    LoaderModule,
    CoreModule,
    GrowlModule,
    DialogModule,
    ButtonModule
  ],
  declarations: [
    RegistrationComponent
  ]
})
export class RegistrationModule { }
