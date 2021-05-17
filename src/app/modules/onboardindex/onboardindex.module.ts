import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { GrowlModule } from 'primeng/growl';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { MaterialModule } from '../../material.module';

import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { DataTableModule } from '../../widgets/datatable/datatable.module';

import { OnBoardIndexRoutingModule } from './onboardindex-routing.module';
import { OnBoardIndexComponent } from './onboardindex.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OnBoardIndexRoutingModule,
    SharedModule,
    CoreModule,
    LoaderModule,
    DataTableModule,
    MyDatePickerModule,
    CalendarModule,
    DialogModule,
    GrowlModule,
    MaterialModule,
    MultiSelectModule,
    DropdownModule
  ],
  declarations: [
    OnBoardIndexComponent
  ],
  providers:[
    DatePipe
  ]
})
export class OnBoardIndexModule { }
