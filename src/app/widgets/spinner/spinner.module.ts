import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { SpinnerComponent } from './spinner.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    declarations:[
        SpinnerComponent
    ],
    providers:[
    ],
    exports: [
        SpinnerComponent
    ]
})

export class LoaderModule { }