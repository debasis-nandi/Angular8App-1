import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { GrowlModule } from 'primeng/growl';
import { MyDatePickerModule } from 'mydatepicker';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { MaterialModule } from '../../material.module';

import { RunDailyRoutingModule } from './rundaily-routing.module';
import { RunDailyComponent } from './rundaily.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { DataTableModule } from '../../widgets/datatable/datatable.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RunDailyRoutingModule,
    SharedModule,
    CoreModule,
    LoaderModule,
    DataTableModule,
    GrowlModule,
    MyDatePickerModule,
    DialogModule,
    MultiSelectModule,
    MaterialModule,
    ButtonModule
  ],
  declarations: [
    RunDailyComponent
  ],
  providers:[
  ]
})
export class RunDailyModule { }
