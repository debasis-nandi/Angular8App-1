import { Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'my-datatable',
    templateUrl: './datatable.component.html',
    styleUrls: ['datatable.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit {

    constructor(private router: Router){
    }

    ngOnInit() {
    }

    ngOnChanges() {
    }

}