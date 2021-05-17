import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgsRevealModule } from 'ngx-scrollreveal';
import { GrowlModule } from 'primeng/growl';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { DataTableModule } from '../../widgets/datatable/datatable.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgsRevealModule,
    DashboardRoutingModule,
    SharedModule,
    CoreModule,
    LoaderModule,
    DataTableModule,
    MaterialModule,
    GrowlModule,
    ChartModule,
    ButtonModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
