import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { GrowlModule } from 'primeng/growl';
import { TreeModule } from 'primeng/tree';

import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { DataTableModule } from '../../widgets/datatable/datatable.module';
import { AdminRoutingModule } from './admin-routing.module';
import { MyDatePickerModule } from 'mydatepicker';

import { ManageClientComponent } from './manage-client/manage-client.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { ManageResourceComponent } from './manage-resource/manage-resource.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    LoaderModule,
    DataTableModule,
    AdminRoutingModule,
    MaterialModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    RadioButtonModule,
    InputTextModule,
    GrowlModule,
    MyDatePickerModule,
    TreeModule 
  ],
  declarations: [
    ManageClientComponent,
    ManageAccountComponent,
    ManageUserComponent,
    ManageRoleComponent,
    ManageResourceComponent
  ],
  providers:[]
})
export class AdminModule { }
