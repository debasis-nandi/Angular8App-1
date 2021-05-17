import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

import { MaterialModule } from '../../material.module';
import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { DataTableModule } from '../../widgets/datatable/datatable.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TestRoutingModule,
    SharedModule,
    CoreModule,
    LoaderModule,
    DataTableModule,
    MaterialModule,
    DialogModule,
    ButtonModule,
    CalendarModule
  ],
  declarations: [
    TestComponent
  ],
  providers:[
  ]
})
export class TestModule { }
