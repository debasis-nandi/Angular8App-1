import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgsRevealModule } from 'ngx-scrollreveal';
import { GrowlModule } from 'primeng/growl';
import { ChartModule } from 'primeng/chart';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

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
    HomeRoutingModule,
    SharedModule,
    CoreModule,
    LoaderModule,
    DataTableModule,
    MaterialModule,
    GrowlModule,
    ChartModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
