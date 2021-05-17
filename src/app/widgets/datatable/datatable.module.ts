import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DataTableComponent } from './datatable.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations:[
        DataTableComponent
    ],
    providers:[
    ],
    exports: [
        DataTableComponent
    ]
})

export class DataTableModule { }